import { defineEventHandler, getCookie, setCookie } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt } from '../../../utils/encrypt'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/callback calling')
  const { op, config } = useRuntimeConfig().openidConnect
  const sessionid = getCookie(event, config.secret)
  const req = event.node.req
  const res = event.node.res
  const issueClient = await initClient(op, req)
  const params = issueClient.callbackParams(req)
  const callBackUrl = op.callbackUrl.replace('cbt', 'callback')

  if (params.access_token) {
    await getUserInfo(params.access_token)
  } else if (params.code) {
    const tokenSet = await issueClient.callback(callBackUrl, params, { nonce: sessionid })
    if (tokenSet.access_token) {
      await getUserInfo(tokenSet.access_token)
    }
  } else {
    console.log('empty callback')
  }
  res.writeHead(302, { Location: '/' })
  res.end()

  async function getUserInfo (accessToken: string) {
    try {
      const userinfo = await issueClient.userinfo(accessToken)
      setCookie(event, config.cookiePrefix + 'access_token', accessToken, {
        maxAge: config.cookieMaxAge
      })
      const cookie = config.cookie
      for (const [key, value] of Object.entries(userinfo)) {
        if (cookie && Object.prototype.hasOwnProperty.call(cookie, key)) {
          setCookie(event, config.cookiePrefix + key, JSON.stringify(value), {
            maxAge: config.cookieMaxAge
          })
        }
      }
      const encryptedText = await encrypt(JSON.stringify(userinfo), config)
      setCookie(event, config.cookiePrefix + 'user_info', encryptedText)
    } catch (err) {
      console.log(err)
    }
  }
})
