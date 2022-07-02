import { useCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { config, op } = useRuntimeConfig().openidConnect
  console.log('oidc/user calling')
  // console.log(req.headers.cookie)

  const sessionid = useCookie(event, config.secret)
  const accesstoken = useCookie(event, config.cookiePrefix + 'access_token')
  const userinfoCookie = useCookie(event, config.cookiePrefix + 'user_info')

  if (userinfoCookie) {
    const userInfoStr = await decrypt(userinfoCookie, config)
    return JSON.parse(userInfoStr)
  } else if (accesstoken) {
    try {
      // load user info from oidc server.
      const issueClient = await initClient(op)
      const userinfo = await issueClient.userinfo(accesstoken)

      // add encrypted userinfo to cookies.
      try {
        const encryptedText = await encrypt(JSON.stringify(userinfo), config)
        setCookie(event, config.cookiePrefix + 'user_info', encryptedText)
      } catch (err) {
        console.error('encrypted userinfo error.', err)
      }
      return userinfo
    } catch (err) {
      console.log(err)
      deleteCookie(event, config.secret)
      deleteCookie(event, config.cookiePrefix + 'access_token')
      deleteCookie(event, config.cookiePrefix + 'user_info')
      const cookie = config.cookie
      if (cookie) {
        for (const [key, value] of Object.entries(cookie)) {
          deleteCookie(event, config.cookiePrefix + key)
        }
      }
      return {}
    }
  } else {
    console.log('empty accesstoken for access userinfo')
    return {}
  }
})
