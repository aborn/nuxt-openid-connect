import { getCookie, deleteCookie, defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const res = event.res
  console.log('oidc/logout calling')

  const { config } = useRuntimeConfig().openidConnect
  deleteCookie(event, config.secret)
  deleteCookie(event, config.cookiePrefix + 'access_token')
  deleteCookie(event, config.cookiePrefix + 'user_info')

  // delete part of cookie userinfo (depends on user's setting.).
  const cookie = config.cookie
  if (cookie) {
    for (const [key, value] of Object.entries(cookie)) {
      deleteCookie(event, config.cookiePrefix + key)
    }
  }

  res.writeHead(302, { Location: '/' })
  res.end()
})
