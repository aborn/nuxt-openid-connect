import { defineEventHandler, setCookie, getCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'

import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  logger.info('[Login]: oidc/login calling')
  const { op, config } = useRuntimeConfig().openidConnect

  const req = event.req
  const res = event.res
  const issueClient = await initClient(op, req)
  const sessionkey = config.secret
  let sessionid = getCookie(event, config.secret)
  if (!sessionid) {
    logger.trace('[Login]: regenerate sessionid')
    sessionid = uuidv4()
  }

  const callbackUrl = (op.callbackUrl && op.callbackUrl.length > 0) ? op.callbackUrl : 'http://' + req.headers.host + '/oidc/cbt'
  logger.trace('[Login]: cabackurl: ', callbackUrl, op.callbackUrl)

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
