import { defineEventHandler, setCookie, useCookie } from 'h3'
import { v4 as uuidv4 } from 'uuid'

import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/login calling')
  const { op, session } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)

  const req = event.req
  const res = event.res

  const sessionkey = session.secret
  let sessionid = useCookie(event, session.secret)
  if (!sessionid) {
    console.log('regenerate sessionid')
    sessionid = uuidv4()
  }

  const parameters = {
    redirect_uri: op.callbackUrl,
    response_type: 'id_token',
    nonce: sessionid,
    scope: ['openid'].concat(op.scope).join(' ') // 'openid'
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  // console.log(authUrl)

  console.log(sessionid)
  setCookie(event, sessionkey, sessionid, {
    maxAge: 24 * 60 * 60 // one day
  })

  res.writeHead(302, { Location: authUrl })
  res.end()
})
