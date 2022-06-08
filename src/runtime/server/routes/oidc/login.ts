import { defineEventHandler } from 'h3'
import Auth from '../../../auth/auth'

const auth = new Auth()

export default defineEventHandler(async (event) => {
  const req = event.req
  console.log(req.url)
  const res = event.res
  const authUrl = await auth.getAuthUrl()
  console.log(authUrl)

  res.writeHead(302, { Location: authUrl })
  res.end()
})
