import { useCookie, deleteCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { session, op } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)
  console.log('oidc/user calling')
  // console.log(req.headers.cookie)

  const sessionid = useCookie(event, session.secret)
  const accesstoken = useCookie(event, session.cookiePrefix + 'access_token')
  // console.log(sessionid)

  if (accesstoken) {
    try {
      const userinfo = await issueClient.userinfo(accesstoken)
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
