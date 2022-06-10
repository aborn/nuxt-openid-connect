# Nuxt OpenID-Connect
OpenID-Connect(OIDC) integration module for nuxt 3.0.

## Features

- An [**Nuxt 3**](https://v3.nuxtjs.org) module 
- OIDC integration ( implemetation base [openid-client](https://github.com/panva/node-openid-client) )
- [State Management](https://v3.nuxtjs.org/guide/features/state-management/), shared login user info.
- OIDC provider config

## Usage

- Add to a project
```bash
yarn add nuxt-openid-connect
```

- Then, add nuxt-openid-connect to the modules section of nuxt.config.ts and modify config as you need:
```ts
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    'nuxt-openid-connect'
  ],
  openidConnect: {
    addPlugin: true,
    oidcProvider: {
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
      secret: 'process.env.OIDC_SESSION_SECRET',
      cookie: {},
      resave: false,
      saveUninitialized: false
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
