import { getCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { setCookieInfo, setCookieTokenAndRefreshToken } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { config, op } = useRuntimeConfig().openidConnect
  console.log('[USER]: oidc/user calling')

  const sessionid = getCookie(event, config.secret)
  const accesstoken = getCookie(event, config.cookiePrefix + 'access_token')
  const refreshToken = getCookie(event, config.cookiePrefix + 'refresh_token')
  const userinfoCookie = getCookie(event, config.cookiePrefix + 'user_info')
  const issueClient = await initClient(op, event.node.req, [])

  if (userinfoCookie) {
    console.log('userinfo:Cookie')
    const userInfoStr: string | undefined = await decrypt(userinfoCookie, config)
    return JSON.parse(userInfoStr ?? '')
  } else if (accesstoken) {
    console.log('userinfo:accesstoken')
    try {
      // load user info from oidc server.
      const userinfo = await issueClient.userinfo(accesstoken)
      // add encrypted userinfo to cookies.
      await setCookieInfo(event, config, userinfo)
      return userinfo
    } catch (err) {
      console.error('[USER]: ' + err)
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
  } else if (refreshToken) {
    console.log('userinfo:refresh token')
    const tokenSet = await issueClient.refresh(refreshToken)
    // console.log('refreshed and validated tokens %j', tokenSet)
    // console.log('refreshed ID Token claims %j', tokenSet.claims())
    if (tokenSet.access_token) {
      const userinfo = await issueClient.userinfo(tokenSet.access_token)
      setCookieTokenAndRefreshToken(event, config, tokenSet)
      await setCookieInfo(event, config, userinfo)
      return userinfo
    } else {
      return {}
    }
    //  console.log('userinfo:' + userinfo)
  } else {
    console.log('[USER]: empty accesstoken for access userinfo')
    return {}
  }
})
