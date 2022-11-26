# Nuxt OpenID-Connect
[![npm version](https://img.shields.io/npm/v/nuxt-openid-connect.svg?style=flat)](https://www.npmjs.com/package/nuxt-openid-connect)

OpenID-Connect(OIDC) integration module for nuxt 3.0. (V0.4.0+ support nuxt 3.0.0-stable.)

## Features

- An [**Nuxt 3**](https://v3.nuxtjs.org) module (Note: nuxt 2.x not supported).
- OIDC integration ( implemetation based on [openid-client](https://github.com/panva/node-openid-client) ).
- [State Management](https://v3.nuxtjs.org/guide/features/state-management/), shared login user info.
- OIDC provider config.
- Encrypt userInfo cookie.
- Support browser localStorage store userInfo, which keep user auth info after page refresh. Similar like [this](https://stackoverflow.com/questions/68174642/how-to-keep-user-authenticated-after-refreshing-the-page-in-nuxtjs).

## Why use this module 

- The official [auth](https://github.com/nuxt-community/auth-module/issues/1719) module doesn't support Nuxt 3.0 yet.
- [nuxt-oidc](https://github.com/deko2369/nuxt-oidc) also not support Nuxt 3.0.

## How to use this module

- Add to a project
```bash
yarn add nuxt-openid-connect
```

- Then, add `nuxt-openid-connect` module to nuxt.config.ts and change to your configs (`openidConnect`):
```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-openid-connect'
  ],
  openidConnect: {
    addPlugin: true,
    op: {
      issuer: 'your_issuer_value',
      clientId: 'your_issuer_clientid',
      clientSecret: 'secret',
      callbackUrl: '',   // optional
      scope: [
        'email',
        'profile',
        'address'
      ]
    },
    config: {
      response_types: 'id_token',
      secret: 'oidc._sessionid',
      cookie: { loginName: '' },
      cookiePrefix: 'oidc._',
      cookieEncrypt: true,
      cookieEncryptKey: 'bfnuxt9c2470cb477d907b1e0917oidc', // 32
      cookieEncryptIV: 'ab83667c72eec9e4', // 16
      cookieEncryptALGO: 'aes-256-cbc',
      cookieMaxAge: 24 * 60 * 60 //  default one day
    }
  }
})

```

Here is an [using example](https://github.com/aborn/playgrounds/tree/main/nuxt-openid-connect-demo).

## 💻 Development

- Clone repository
- Install dependencies using `yarn install`
- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.

## License

[MIT](./LICENSE) - Made with 💚
