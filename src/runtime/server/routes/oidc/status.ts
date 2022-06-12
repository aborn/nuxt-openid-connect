import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const req = event.req
  return {
    api: 'nuxt-openid-connect api works'
  }
})
