import { getCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { logger } from '../../../utils/logger'
import { setCookieInfo, setCookieTokenAndRefreshToken } from '../../../utils/utils'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { config, op } = useRuntimeConfig().openidConnect
  logger.debug('[USER]: oidc/user calling')
  logger.trace('[USER]: ' + event.req.headers.cookie)

  const sessionid = getCookie(event, config.secret)
  const accesstoken = getCookie(event, config.cookiePrefix + 'access_token')
  const idToken = getCookie(event, config.cookiePrefix + 'id_token')
  const refreshToken = getCookie(event, config.cookiePrefix + 'refresh_token')
  const userinfoCookie = getCookie(event, config.cookiePrefix + 'user_info')
  const issueClient = await initClient(op, event.node.req, [])

  if (userinfoCookie) {
    logger.info('userinfo:Cookie')
    const userInfoStr: string | undefined = await decrypt(userinfoCookie, config)
    return JSON.parse(userInfoStr ?? '')
  } else if (accesstoken) {
    logger.info('userinfo:accesstoken')
    try {
      // load user info from oidc server.
      const userinfo = await issueClient.userinfo(accesstoken)
      // add encrypted userinfo to cookies.
      await setCookieInfo(event, config, userinfo)
      return userinfo
    } catch (err) {
      logger.error('[USER]: ' + err)
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
    logger.info('userinfo:refresh token')
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
    //  logger.info('userinfo:' + userinfo)
  } else if (idToken) {
    logger.info('id_token==', idToken)
    const tokenSet = await issueClient.callback('/', { id_token: idToken })
    logger.info('111# received and validated tokens %j', tokenSet)
    logger.info('222# validated ID Token claims %j', tokenSet.claims())
    return tokenSet.claims()
  } else {
    logger.debug('[USER]: empty accesstoken for access userinfo')
    return {}
  }
})
