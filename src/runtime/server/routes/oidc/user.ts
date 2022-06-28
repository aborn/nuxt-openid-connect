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
    console.log('load user info from cookie')
    console.log(userInfoStr)
    return JSON.parse(userInfoStr)
  } else if (accesstoken) {
    try {
      const userinfo = await issueClient.userinfo(accesstoken)

      // use info cookie setting.
      const encryptedText = await encrypt(JSON.stringify(userinfo))
      setCookie(event, session.cookiePrefix + 'user_info', encryptedText)
      return userinfo
    } catch (err) {
      console.log(err)
      deleteCookie(event, session.cookiePrefix + 'access_token')
      return {}
    }
  } else {
    console.log('empty accesstoken for access userinfo')
    return {}
  }
})
