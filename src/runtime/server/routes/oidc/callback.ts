import { defineEventHandler, useCookie, setCookie } from 'h3'

import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/callback calling')
  const { op, session } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)
  const sessionid = useCookie(event, session.secret)
  // console.log(sessionid)

  const req = event.req
  const res = event.res
  // console.log(event.context.params)
  const params = issueClient.callbackParams(req)

  // TODO id_token check
  // const callBackUrl = op.callbackUrl.replace('cbt', 'callback')
  // const tokenSet = await issueClient.callback(callBackUrl, event.context.params, { nonce: sessionid })
  // console.log('received and validated tokens %j', tokenSet)
  // console.log('validated ID Token claims %j', tokenSet.claims())

  // console.log(params)
  if (params.access_token) {
    try {
      const userinfo = await issueClient.userinfo(params.access_token)
      setCookie(event, session.cookiePrefix + 'access_token', params.access_token, {
        maxAge: session.maxAge // one day
      })
      const cookie = session.cookie
      for (const [key, value] of Object.entries(userinfo)) {
        if (cookie && Object.prototype.hasOwnProperty.call(cookie, key)) {
          setCookie(event, session.cookiePrefix + key, JSON.stringify(value), {
            maxAge: session.maxAge // one day
          })
        }
      }
      // use info cookie setting.
      const encryptedText = await encrypt(JSON.stringify(userinfo))
      setCookie(event, session.cookiePrefix + 'user_info', encryptedText)
    } catch (err) {
      console.log(err)
    }
    // console.log(userinfo)
  } else {
    console.log('empty callback')
  }
  res.writeHead(302, { Location: '/' })
  res.end()
})
