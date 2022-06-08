import { createError, defineEventHandler } from 'h3'
import Auth from '../../../auth/auth'

const auth = new Auth()

export default defineEventHandler(async (event) => {
  const req = event.req
  // console.log(req)
  console.log(event.context.params)
  const client = await auth.initClient()

  const params = client.callbackParams(req)

  console.log(params)
  if (params.access_token) {
    const userinfo = await client.userinfo(params.access_token)
    console.log(userinfo)
    return userinfo
  } else {
    console.log('empty')
    return {}
  }
})
