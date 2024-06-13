import { getCookie, deleteCookie, defineEventHandler } from 'h3'
import { getRedirectUrl } from '../../../utils/utils';
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  console.log('---------oidc nitro --------------')
  const res = event.node.res
  const req = event.node.req
  const { app } = useRuntimeConfig()
  const baseUrl = app.baseURL

  console.log('[LOGOUT]: oidc/logout calling')

  const { config } = useRuntimeConfig().openidConnect
  const redirectUrl = getRedirectUrl(req.url, baseUrl)
  deleteCookie(event, config.secret)
  deleteCookie(event, config.cookiePrefix + 'access_token')
  deleteCookie(event, config.cookiePrefix + 'refresh_token')
  deleteCookie(event, config.cookiePrefix + 'user_info')

  // delete part of cookie userinfo (depends on user's setting.).
  const cookie = config.cookie
  if (cookie) {
    for (const [key, value] of Object.entries(cookie)) {
      deleteCookie(event, config.cookiePrefix + key)
    }
  }

  res.writeHead(302, { Location: redirectUrl })
  res.end()
})
