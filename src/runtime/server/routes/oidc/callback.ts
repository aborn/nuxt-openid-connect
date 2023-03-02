import * as http from 'http'
import { defineEventHandler, getCookie, setCookie } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt } from '../../../utils/encrypt'
import { logger } from '../../../utils/logger'
import { getRedirectUrl, getCallbackUrl, getDefaultBackUrl, getResponseMode } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const req = event.node.req
  const res = event.node.res
  logger.info('[CALLBACK]: oidc/callback calling, method:' + req.method)

  let request = req
  if (req.method === 'POST') {
    // response_mode=form_post ('POST' method)
    const body = await readBody(event)
    request = {
      method: req.method,
      url: req.url,
      body
    } as unknown as http.IncomingMessage
  }

  const { op, config } = useRuntimeConfig().openidConnect
  const responseMode = getResponseMode(config)
  const sessionid = getCookie(event, config.secret)
  const redirectUrl = getRedirectUrl(req.url)
  // logger.info('---Callback. redirectUrl:' + redirectUrl)
  // logger.info(' -- req.url:' + req.url + '   #method:' + req.method + ' #response_mode:' + responseMode)

  const callbackUrl = getCallbackUrl(op.callbackUrl, redirectUrl, req.headers.host)
  const defCallBackUrl = getDefaultBackUrl(redirectUrl, req.headers.host)

  const issueClient = await initClient(op, req, [defCallBackUrl, callbackUrl])
  const params = issueClient.callbackParams(request)

  if (params.access_token) {
    // Implicit ID Token Flow: access_token
    logger.debug('[CALLBACK]: has access_token in params, accessToken:' + params.access_token)
    await getUserInfo(params.access_token)
    res.writeHead(302, { Location: redirectUrl || '/' })
    res.end()
  } else if (params.code) {
    // Authorization Code Flow: code -> access_token
    logger.debug('[CALLBACK]: has code in params')
    const callBackUrl = op.callbackUrl.replace('cbt', 'callback')
    const tokenSet = await issueClient.callback(callBackUrl, params, { nonce: sessionid })
    if (tokenSet.access_token) {
      await getUserInfo(tokenSet.access_token)
    }
    res.writeHead(302, { Location: redirectUrl || '/' })
    res.end()
  } else {
    // Error dealing.
    // eslint-disable-next-line no-lonely-if
    if (params.error) {
      // redirct to auth failed error page.
      logger.error('[CALLBACK]: error callback')
      logger.error(params.error + ', error_description:' + params.error_description)
      res.writeHead(302, { Location: '/oidc/error' })
      res.end()
    } else if (responseMode === 'fragment') {
      logger.warn('[CALLBACK]: callback redirect')
      res.writeHead(302, { Location: '/oidc/cbt?redirect=' + redirectUrl })
      res.end()
    } else {
      logger.error('[CALLBACK]: error callback')
      res.writeHead(302, { Location: redirectUrl || '/' })
      res.end()
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const userinfo = await issueClient.userinfo(accessToken)
      // logger.info(userinfo)
      setCookie(event, config.cookiePrefix + 'access_token', accessToken, {
        maxAge: config.cookieMaxAge,
        ...config.cookieFlags['access_token' as keyof typeof config.cookieFlags]
      })
      const cookie = config.cookie
      for (const [key, value] of Object.entries(userinfo)) {
        if (cookie && Object.prototype.hasOwnProperty.call(cookie, key)) {
          setCookie(event, config.cookiePrefix + key, JSON.stringify(value), {
            maxAge: config.cookieMaxAge,
            ...config.cookieFlags[key as keyof typeof config.cookieFlags]
          })
        }
      }
      const encryptedText = await encrypt(JSON.stringify(userinfo), config)
      setCookie(event, config.cookiePrefix + 'user_info', encryptedText, { ...config.cookieFlags['user_info' as keyof typeof config.cookieFlags] })
    } catch (err) {
      logger.error('[CALLBACK]: ' + err)
    }
  }
})
