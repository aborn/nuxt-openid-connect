import openidConnect from '..'

export default defineNuxtConfig({
  modules: [
    openidConnect
  ],
  openidConnect: {
    addPlugin: true,
    op: {
      issuer: 'https://bf01.verify.ibm.com/oidc/endpoint/default/.well-known/openid-configuration',
      clientId: '92fdf09c-f628-4b8d-8a29-7ebe8ff77d94',
      clientSecret: 'lzdz0b47nW',
      callbackUrl: '',   // optional
      scope: [
        'email',
        'profile',
        'address'
      ]
    },
    config: {
      response_types: 'token id_token',
      secret: 'oidc._sessionid',
      cookie: {loginName: ''},
      cookiePrefix: 'oidc._',
      cookieEncrypt: true,
      cookieEncryptKey: 'bfnuxt9c2470cb477d907b1e0917oidc', // 32
      cookieEncryptIV: 'ab83667c72eec9e4', // 16
      cookieEncryptALGO: 'aes-256-cbc',
      cookieMaxAge: 24 * 60 * 60 //  default one day
    }
  }
})
