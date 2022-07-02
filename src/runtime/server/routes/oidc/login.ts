import { defineEventHandler, setCookie, useCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'

import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/login calling')
  const { op, config } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)

  const req = event.req
  const res = event.res

  const sessionkey = config.secret
  let sessionid = useCookie(event, config.secret)
  if (!sessionid) {
    // console.log('regenerate sessionid')
    sessionid = uuidv4()
  }

  const callbackUrl = 'http://' + req.headers.host + '/oidc/cbt'
  console.log('cabackurl:', callbackUrl, op.callbackUrl)

  const parameters = {
    redirect_uri: callbackUrl,
    response_type: 'id_token',
    nonce: sessionid,
    scope: ['openid'].concat(op.scope).join(' ') // 'openid'
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  // console.log(authUrl)

  console.log(sessionid)
  setCookie(event, sessionkey, sessionid, {
    maxAge: config.cookieMaxAge
  })

  res.writeHead(302, { Location: authUrl })
  res.end()
})
