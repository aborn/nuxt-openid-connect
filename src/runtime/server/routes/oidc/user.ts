import { useCookie, defineEventHandler } from 'h3'
import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { session, op } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)
  console.log('oidc/user calling')
  // console.log(req.headers.cookie)

  const sessionid = useCookie(event, session.secret)
  const accesstoken = useCookie(event, 'oidc._access_token')
  // console.log(sessionid)

  if (accesstoken) {
    try {
      const userinfo = await issueClient.userinfo(accesstoken)
      return userinfo
    } catch (err) {
      return {}
    }
  } else {
    console.log('empty userinfo')
    return {}
  }
})
