import * as http from 'http'
import { defineEventHandler, getCookie, setCookie, deleteCookie } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt } from '../../../utils/encrypt'
import { logger } from '../../../utils/logger'
import { getRedirectUrl, getCallbackUrl, getDefaultBackUrl, getResponseMode, setCookieInfo, setCookieTokenAndRefreshToken, setIdToken } from '../../../utils/utils'
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
  logger.info('params=', params)
  logger.info('sessionid:' + sessionid)

  if (params.access_token) {
    // Implicit ID Token Flow: access_token
    logger.debug('[CALLBACK]: has access_token in params, accessToken:' + params.access_token)
    await processUserInfo(params.access_token, null, event)
    res.writeHead(302, { Location: redirectUrl || '/' })
    res.end()
  } else if (params.code) {
    // Authorization Code Flow: code -> access_token
    logger.debug('[CALLBACK]: has code in params, code:' + params.code + ' ,sessionid=' + sessionid)
    const tokenSet = await issueClient.callback(callbackUrl, params, { nonce: sessionid })
    deleteCookie(event, config.secret)
    if (tokenSet.access_token) {
      await processUserInfo(tokenSet.access_token, tokenSet, event)
    }
    res.writeHead(302, { Location: redirectUrl || '/' })
    res.end()
  } else {
    // Error dealing.
    // eslint-disable-next-line no-lonely-if
    if (params.id_token) {
      const tokenSet = await issueClient.callback(callbackUrl, params, { nonce: sessionid })
      logger.info('1# received and validated tokens %j', tokenSet)
      logger.info('2# validated ID Token claims %j', tokenSet.claims())
      if (tokenSet.access_token) {
        await processUserInfo(tokenSet.access_token, tokenSet, event)
      } else {
        logger.info('3# fgg')
        await processUserInfo(tokenSet.claims(), tokenSet, event)
      }
      res.writeHead(302, { Location: redirectUrl || '/' })
      res.end()
    } else if (params.error) {
      // redirct to auth failed error page.
      logger.error('[CALLBACK]: error callback')
      logger.error(params.error + ', error_description:' + params.error_description)
      res.writeHead(302, { Location: '/oidc/error' })
      res.end()
    } else if (responseMode === 'fragment') {
      logger.warn('[CALLBACK]: callback redirect responseMode="fragment"' + 'redirect to:==> /oidc/cbt?redirect=' + redirectUrl)
      res.writeHead(302, { Location: '/oidc/cbt?redirect=' + redirectUrl })
      res.end()
    } else {
      logger.error('[CALLBACK]: error callback')
      res.writeHead(302, { Location: redirectUrl || '/' })
      res.end()
    }
  }

  async function processUserInfo(accessTokenOrInfo: string | object, tokenSet: any, event: any) {
    try {
      const userinfo = (typeof accessTokenOrInfo === 'string') ? await issueClient.userinfo(accessTokenOrInfo) : accessTokenOrInfo
      const { config } = useRuntimeConfig().openidConnect

      // token and refresh token setting
      if (tokenSet) {
        setCookieTokenAndRefreshToken(event, config, tokenSet)
      }

      // userinfo setting
      await setCookieInfo(event, config, userinfo)
    } catch (err) {
      logger.error('[CALLBACK]: ' + err)
    }
  }
})
