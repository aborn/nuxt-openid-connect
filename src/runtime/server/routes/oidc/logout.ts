import { useCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  const res = event.res
  console.log('oidc/logout calling')

  const { session } = useRuntimeConfig().openidConnect
  deleteCookie(event, session.secret)
  deleteCookie(event, session.cookiePrefix + 'access_token')
  // console.log(sessionid)

  res.writeHead(302, { Location: '/' })
  res.end()
})
