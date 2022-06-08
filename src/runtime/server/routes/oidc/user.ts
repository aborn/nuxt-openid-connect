import { createError, defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  console.log('oidc/user calling')
  return {
  }
})
