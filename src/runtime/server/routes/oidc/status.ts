import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  console.log('---------oidc nitro --------------')
  const config = useRuntimeConfig()
  const baseUrl = config.app.baseURL
  const query = getQuery(event)
  const req = event.node.req

  // console.log(req.headers)

  console.log(req.url)
  console.log(baseUrl)
  return {
    api: 'nuxt-openid-connect api works'
  }
})
