import { defineNuxtConfig } from 'nuxt'
import openidConnect from '..'

export default defineNuxtConfig({
  modules: [
    openidConnect
  ],
  openidConnect: {
    addPlugin: true,
    op: {
      issuer: 'your_issuer_value',
      clientId: 'clientid',
      clientSecret: 'secret',
      callbackUrl: 'http://localhost:3000/oidc/cbt',
      scope: [
        'email',
        'profile',
        'address'
      ]
    },
    session: {
      cookie: { loginName: '' },
      cookiePrefix: 'oidc._',
      secret: 'oidc._sessionid',
      maxAge: 24 * 60 * 60 // one day
    }
  }
})
