import { useCookie, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const req = event.req
  const res = event.res
  const { session } = useRuntimeConfig().openidConnect
  console.log('oidc/user calling')
  // console.log(req.headers.cookie)

  const sessionid = useCookie(event, session.secret)
  console.log(sessionid)
  /* setCookie(event, 'sessionid', 'uid', {
    maxAge: 24 * 60 * 60 // oneday
  }) */
  return {
  }
})
