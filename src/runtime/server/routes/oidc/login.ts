import { defineEventHandler, setCookie, getCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'
import { generators } from 'openid-client'
import { initClient } from '../../../utils/issueclient'
import { getRedirectUrl, getCallbackUrl, getDefaultBackUrl, getResponseMode } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('---------oidc nitro --------------')
  console.log('[Login]: oidc/login calling')
  const req = event.node.req
  const res = event.node.res
  const { app } = useRuntimeConfig()
  const baseUrl = app.baseURL

  const { op, config } = useRuntimeConfig().openidConnect
  const redirectUrl = getRedirectUrl(req.url, baseUrl)
  const callbackUrl = getCallbackUrl(redirectUrl, req.headers.host)
  const defCallBackUrl = getDefaultBackUrl(redirectUrl, req.headers.host)

  const issueClient = await initClient(op, req, [defCallBackUrl, callbackUrl])
  const sessionkey = config.secret
  let sessionid = getCookie(event, config.secret)
  if (!sessionid) {
    sessionid = generators.nonce()
    console.log('[Login]: regenerate sessionid=' + sessionid)
  } else {
    console.log('[Login]: cookie sessionid=' + sessionid)
  }

  const responseMode = getResponseMode(config)
  const scopes = op.scope.includes('openid') ? op.scope : [...op.scope, 'openid']
  console.log('[Login]: cabackurl & op.callbackUrl & redirecturl: ', callbackUrl, op.callbackUrl, redirectUrl)
  console.log('  response_mode:' + responseMode + ', response_type:' + config.response_type + ', scopes:' + scopes.join(' '))

  const parameters = {
    redirect_uri: callbackUrl,
    response_type: config.response_type,
    response_mode: responseMode,
    nonce: sessionid,
    scope: scopes.join(' ')
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  console.log('[Login]: Auth Url: ' + authUrl + ',    #sessionid:' + sessionid)

  if (sessionid) {
    setCookie(event, sessionkey, sessionid, {
      maxAge: config.cookieMaxAge,
      ...config.cookieFlags[sessionkey as keyof typeof config.cookieFlags]
    })
  }

  res.writeHead(302, { Location: authUrl })
  res.end()
})
