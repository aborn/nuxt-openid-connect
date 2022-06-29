import { useCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const res = event.res
  console.log('oidc/logout calling')

  const { session } = useRuntimeConfig().openidConnect
  deleteCookie(event, session.secret)
  deleteCookie(event, session.cookiePrefix + 'access_token')
  deleteCookie(event, session.cookiePrefix + 'user_info')

  // delete part of cookie userinfo (depends on user's setting.).
  const cookie = session.cookie
  if (cookie) {
    for (const [key, value] of Object.entries(cookie)) {
      deleteCookie(event, session.cookiePrefix + key)
    }
  }

  res.writeHead(302, { Location: '/' })
  res.end()
})
