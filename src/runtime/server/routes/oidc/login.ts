import { defineEventHandler, setCookie, getCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'
import { generators } from 'openid-client'
import { initClient } from '../../../utils/issueclient'
import { logger } from '../../../utils/logger'
import { getRedirectUrl, getCallbackUrl, getDefaultBackUrl } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  logger.info('[Login]: oidc/login calling')
  const req = event.node.req
  const res = event.node.res

  const { op, config } = useRuntimeConfig().openidConnect
  const redirectUrl = getRedirectUrl(req.url)
  const callbackUrl = getCallbackUrl(op.callbackUrl, redirectUrl, req.headers.host)
  const defCallBackUrl = getDefaultBackUrl(redirectUrl, req.headers.host)

  const issueClient = await initClient(op, req, [defCallBackUrl, callbackUrl])
  const sessionkey = config.secret
  let sessionid = getCookie(event, config.secret)
  if (!sessionid) {
    logger.trace('[Login]: regenerate sessionid')
    sessionid = generators.nonce() // uuidv4()
  }

  const responseMode = getResponseMode(config)
  const scopes = op.scope.includes('openid') ? op.scope : [...op.scope, 'openid']
  logger.info('[Login]: cabackurl & op.callbackUrl & redirecturl: ', callbackUrl, op.callbackUrl, redirectUrl)
  logger.info('  response_mode:' + responseMode + ', response_type:' + config.response_type + ', scopes:' + scopes.join(' '))

  const parameters = {
    redirect_uri: callbackUrl,
    response_type: config.response_type,
    response_mode: responseMode,
    nonce: sessionid,
    scope: scopes.join(' ')
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  logger.info('[Login]: Auth Url: ' + authUrl)

  logger.info('[Login]: sessionid: ' + sessionid)
  if (sessionid) {
    setCookie(event, sessionkey, sessionid, {
      maxAge: config.cookieMaxAge,
      ...config.cookieFlags[sessionkey as keyof typeof config.cookieFlags]
    })
  }

  res.writeHead(302, { Location: authUrl })
  res.end()
})

/**
   * Response Mode
   *   The Response Mode determines how the Authorization Server returns result parameters from the Authorization Endpoint.
   *   Non-default modes are specified using the response_mode request parameter. If response_mode is not present in a request, the default Response Mode mechanism specified by the Response Type is used.
   *
   * REF:
   *   https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html (English)
   *   https://linianhui.github.io/authentication-and-authorization/05-openid-connect-extension/  (Chinese)
   *
   * response_mode
   * 1. query
   *    In this mode, Authorization Response parameters are encoded in the query string added to the redirect_uri when redirecting back to the Client.
   *    callback http.method: 'GET'
   *    example: https://client.lnh.dev/oauth2-callback?code=SplxlOBeZQQYbYS6WxSbIA&state=xyz
   * 2. fragment
   *    In this mode, Authorization Response parameters are encoded in the fragment added to the redirect_uri when redirecting back to the Client.
   *    callback http.method: 'GET'
   *    example: http://client.lnh.dev/oauth2-callback#access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&expires_in=3600
   * 3. form_post (Callback method 'POST') (REF: https://openid.net/specs/oauth-v2-form-post-response-mode-1_0.html)
   *
   * Hints:
   * i)  For purposes of this specification, the default Response Mode for the OAuth 2.0 code Response Type is the query encoding.
   * ii) For purposes of this specification, the default Response Mode for the OAuth 2.0 token Response Type is the fragment encoding.
   */
function getResponseMode(config: any): string {
  const responseType = config.response_type
  return config.response_mode || getDefaultResponseMode(responseType)
}

function getDefaultResponseMode(responseType: string): string {
  const resTypeArray = responseType.match(/[^ ]+/g)
  if (resTypeArray && resTypeArray?.findIndex(i => i === 'code') >= 0) {
    return 'query'
  } else if (resTypeArray && resTypeArray?.findIndex(i => i === 'token')) {
    return 'fragment'
  }
  return 'query'
}
