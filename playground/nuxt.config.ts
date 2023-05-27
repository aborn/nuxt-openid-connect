
export default defineNuxtConfig({
  app: {
    head: {
      title: 'OIDC',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/@picocss/pico@latest/css/pico.min.css'
        }
      ]
    }
  },

  modules: [
    'nuxt-openid-connect'
  ],

  runtimeConfig: {
    openidConnect: {
      op: {
        issuer: '',
        clientId: '',
        clientSecret: '',
        callbackUrl: ''
      },
      config: {
        cookieFlags: {
          access_token: {
            httpOnly: true,
            secure: false
          }
        }
      }
    }
  },

  openidConnect: {
    addPlugin: true,
    op: {
      issuer: 'http://192.168.26.114:8080/realms/test', // change to your OP addrress
      clientId: 'testClient',
      clientSecret: 'cnuLA78epx8s8vMbRxcaiXbzlS4u8bSA',
      callbackUrl: 'http://192.168.26.114:3000/oidc/callback', // optional
      scope: [
        'email',
        'profile',
        'address'
      ]
    },
    config: {
      debug: true,
      response_type: 'code',
      secret: 'oidc._sessionid',
      isCookieUserInfo: false, // whether save userinfo into cookie.
      cookie: { loginName: '' },
      cookiePrefix: 'oidc._',
      cookieEncrypt: true,
      cookieEncryptKey: 'bfnuxt9c2470cb477d907b1e0917oidc',
      cookieEncryptIV: 'ab83667c72eec9e4',
      cookieEncryptALGO: 'aes-256-cbc',
      cookieMaxAge: 24 * 60 * 60, //  default one day
      cookieFlags: {
        access_token: {
          httpOnly: true,
          secure: false
        }
      }
    }
  }
})
