import { getCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { encrypt, decrypt } from '../../../utils/encrypt'
import { logger } from '../../../utils/logger'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { config, op } = useRuntimeConfig().openidConnect
  logger.debug('[USER]: oidc/user calling')
  logger.trace('[USER]: ' + event.req.headers.cookie)

  const sessionid = getCookie(event, config.secret)
  const accesstoken = getCookie(event, config.cookiePrefix + 'access_token')
  const userinfoCookie = getCookie(event, config.cookiePrefix + 'user_info')

  if (userinfoCookie) {
    const userInfoStr: string | undefined = await decrypt(userinfoCookie, config)
    return JSON.parse(userInfoStr ?? '')
  } else if (accesstoken) {
    try {
      // load user info from oidc server.
      const issueClient = await initClient(op, event.req)
      const userinfo = await issueClient.userinfo(accesstoken)

      // add encrypted userinfo to cookies.
      try {
        const encryptedText = await encrypt(JSON.stringify(userinfo), config)
        setCookie(event, config.cookiePrefix + 'user_info', encryptedText, { ...config.cookieFlags['user_info' as keyof typeof config.cookieFlags] })
      } catch (err) {
        logger.error('encrypted userinfo error.', err)
      }
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
  } else {
    logger.debug('[USER]: empty accesstoken for access userinfo')
    return {}
  }
})
