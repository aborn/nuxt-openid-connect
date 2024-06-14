import { fileURLToPath } from 'url'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'

export type CookieSerializeOptions = {
  domain?: string | undefined;
  encode?(value: string): string;
  expires?: Date | undefined;
  httpOnly?: boolean | undefined;
  maxAge?: number | undefined;
  path?: string | undefined;
  sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined;
  secure?: boolean | undefined;
}

export type OidcProvider = {
  issuer: string,
  clientId: string,
  clientSecret: string,
  callbackUrl: string,
  scope: Array<string>
}

export type Config = {
  secret: string,
  cookie: {},
  cookiePrefix: string,
  cookieEncrypt: boolean,
  cookieEncryptKey: string,
  cookieEncryptIV: string,
  cookieEncryptALGO: string,
  cookieMaxAge: number,
  response_type: string,
  response_mode?: string,
  cookieFlags?: {
    [key: string]: CookieSerializeOptions,
  }
  debug?: boolean | undefined,
}

export interface ModuleOptions {
  addPlugin: boolean,
  op: OidcProvider,
  config: Config
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'openidConnect',
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: '>=3.0.0-rc.8'
    }
  },
  defaults: {
    addPlugin: true,
    op: {
      issuer: '',
      clientId: '',
      clientSecret: '',
      callbackUrl: '',
      scope: [
      ]
    },
    // express-session configuration
    config: {
      debug: false,
      secret: 'oidc._sessionid', // process.env.OIDC_SESSION_SECRET
      cookie: {},
      cookiePrefix: 'oidc._',
      cookieEncrypt: true,
      cookieEncryptKey: 'bfnuxt9c2470cb477d907b1e0917oidc',
      cookieEncryptIV: 'ab83667c72eec9e4',
      cookieEncryptALGO: 'aes-256-cbc',
      cookieMaxAge: 24 * 60 * 60, //  default one day
      response_type: 'id_token',
      cookieFlags: {}
    }
  },
  setup(options, nuxt) {
    console.log('[DEBUG MODE]: ', options.config.debug)
    console.debug('[WITHOUT ENV VARS] options:', options)

    const { resolve } = createResolver(import.meta.url)
    const resolveRuntimeModule = (path: string) => resolve('./runtime', path)

    nuxt.hook('nitro:config', (nitroConfig) => {
      // Add server handlers
      nitroConfig.handlers = nitroConfig.handlers || []
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/status',
        handler: resolveRuntimeModule('./server/routes/oidc/status')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/login',
        handler: resolveRuntimeModule('./server/routes/oidc/login')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/logout',
        handler: resolveRuntimeModule('./server/routes/oidc/logout')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/callback',
        handler: resolveRuntimeModule('./server/routes/oidc/callback')
      })
      nitroConfig.handlers.push({
        method: 'post',
        route: '/oidc/callback',
        handler: resolveRuntimeModule('./server/routes/oidc/callback')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/user',
        handler: resolveRuntimeModule('./server/routes/oidc/user')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/cbt',
        handler: resolveRuntimeModule('./server/routes/oidc/cbt')
      })
      nitroConfig.handlers.push({
        method: 'post',
        route: '/oidc/cbt',
        handler: resolveRuntimeModule('./server/routes/oidc/cbt')
      })
      nitroConfig.handlers.push({
        method: 'get',
        route: '/oidc/error',
        handler: resolveRuntimeModule('./server/routes/oidc/error')
      })

      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [
          // Inline module runtime in Nitro bundle
          resolve('./runtime')
        ]
      })
    })
    const publicOps = Object.assign({}, options.op)
    const cnfg = Object.assign({}, options.config)
    publicOps.clientSecret = ''
    cnfg.cookieEncryptALGO = ''
    cnfg.cookieEncryptIV = ''
    cnfg.cookieEncryptKey = ''

    nuxt.options.runtimeConfig.public.openidConnect = defu(nuxt.options.runtimeConfig.public.openidConnect, {
      op: publicOps,
      config: cnfg
    })

    // openidConnect config will use in server
    nuxt.options.runtimeConfig.openidConnect = {
      ...options as any
    }

    if (options.addPlugin) {
      const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
      nuxt.options.build.transpile.push(runtimeDir)
      addPlugin(resolve(runtimeDir, 'plugin'))

      nuxt.hook('imports:dirs', (dirs) => {
        dirs.push(resolve(runtimeDir, 'composables'))
      })
    }
  }
})
