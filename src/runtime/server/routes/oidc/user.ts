import { useCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { session, op } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)
  console.log('oidc/user calling')
  // console.log(req.headers.cookie)

  const sessionid = useCookie(event, session.secret)
  const accesstoken = useCookie(event, session.cookiePrefix + 'access_token')
  const userinfoCookie = useCookie(event, session.cookiePrefix + 'user_info')

  if (userinfoCookie) {
    const userInfoStr = await decrypt(userinfoCookie)
    return JSON.parse(userInfoStr)
  } else if (accesstoken) {
    try {
      // load user info from oidc server.
      const userinfo = await issueClient.userinfo(accesstoken)

      // add encrypted userinfo to cookies.
      try {
        const encryptedText = await encrypt(JSON.stringify(userinfo))
        setCookie(event, session.cookiePrefix + 'user_info', encryptedText)
      } catch (err) {
        console.error('encrypted userinfo error.', err)
      }
      return userinfo
    } catch (err) {
      console.log(err)
      deleteCookie(event, session.secret)
      deleteCookie(event, session.cookiePrefix + 'access_token')
      deleteCookie(event, session.cookiePrefix + 'user_info')
      const cookie = session.cookie
      if (cookie) {
        for (const [key, value] of Object.entries(cookie)) {
          deleteCookie(event, session.cookiePrefix + key)
        }
      }
      return {}
    }
  } else {
    console.log('empty accesstoken for access userinfo')
    return {}
  }
})
