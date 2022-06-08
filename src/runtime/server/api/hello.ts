import { createError, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  return {
    api: 'nuxt-openid-connect api works'
  }
})
