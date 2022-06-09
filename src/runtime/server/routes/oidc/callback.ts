import { defineEventHandler, useCookie } from 'h3'

import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/callback calling')
  const { op, session } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)
  const sessionid = useCookie(event, session.secret)
  console.log(sessionid)

  const req = event.req
  const res = event.res
  console.log(event.context.params)
  const params = issueClient.callbackParams(req)

  // TODO id_token check
  // const callBackUrl = op.callbackUrl.replace('cbt', 'callback')
  // const tokenSet = await issueClient.callback(callBackUrl, event.context.params, { nonce: sessionid })
  // console.log('received and validated tokens %j', tokenSet)
  // console.log('validated ID Token claims %j', tokenSet.claims())

  console.log(params)
  if (params.access_token) {
    setCookie(event, 'oidc._access_token', params.access_token, {
      maxAge: 24 * 60 * 60 // one day
    })
    const userinfo = await issueClient.userinfo(params.access_token)
    console.log(userinfo)
  } else {
    console.log('empty callback')
  }
  res.writeHead(302, { Location: '/' })
  res.end()
})
