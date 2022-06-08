import { defineNuxtConfig } from 'nuxt'
import openidConnect from '..'

export default defineNuxtConfig({
  modules: [
    openidConnect
  ],
  openidConnect: {
    addPlugin: true,
    oidcProvider: {
      issuer: 'your_issuer_value',
      clientId: 'clientid',
      clientSecret: 'secret',
      callbackUrl: 'http://localhost:3000/oidc/callback',
      scope: [
        'email',
        'profile',
        'address'
      ]
    },
    session: {
      secret: 'process.env.OIDC_SESSION_SECRET',
      cookie: {},
      resave: false,
      saveUninitialized: false
    }
  }
})
