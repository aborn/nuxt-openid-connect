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
    config: {
      secret: 'oidc._sessionid',
      cookie: { loginName: '' },
      cookiePrefix: 'oidc._',
      cookieEncrypt: true,
      cookieEncryptKey: 'bfnuxt9c2470cb477d907b1e0917oidc',
      cookieEncryptIV: 'ab83667c72eec9e4',
      cookieEncryptALGO: 'aes-256-cbc',
      cookieMaxAge: 24 * 60 * 60 //  default one day
    }
  }
})
