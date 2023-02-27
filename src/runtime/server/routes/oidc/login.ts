import { defineEventHandler, setCookie, getCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'
import { initClient } from '../../../utils/issueclient'
import { logger } from '../../../utils/logger'
import { getRedirectUrl } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  logger.info('[Login]: oidc/login calling')
  const { op, config } = useRuntimeConfig().openidConnect

  const req = event.node.req
  const redirectUrl = getRedirectUrl(req.url)
  const res = event.node.res
  const issueClient = await initClient(op, req)
  const sessionkey = config.secret
  let sessionid = getCookie(event, config.secret)
  if (!sessionid) {
    logger.trace('[Login]: regenerate sessionid')
    sessionid = uuidv4()
  }

  const callbackUrl = 'http://' + req.headers.host + '/oidc/cbt?redirect=' + redirectUrl
  logger.info('[Login]: cabackurl & redirecturl: ', callbackUrl, op.callbackUrl, redirectUrl)

  const parameters = {
    redirect_uri: callbackUrl,
    response_type: config.response_type,
    nonce: sessionid,
    scope: op.scope.join(' ') // 'openid' will be added by default
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  logger.trace('[Login]: Auth Url: ' + authUrl)

  logger.debug('[Login]: sessionid: ' + sessionid)
  if (sessionid) {
    setCookie(event, sessionkey, sessionid, {
      maxAge: config.cookieMaxAge,
      ...config.cookieFlags[sessionkey as keyof typeof config.cookieFlags]
    })
  }

  res.writeHead(302, { Location: authUrl })
  res.end()
})
