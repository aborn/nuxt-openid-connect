
import { ModuleOptions } from './module'

declare module '@nuxt/schema' {
  interface NuxtConfig { ['openidConnect']?: Partial<ModuleOptions> }
  interface NuxtOptions { ['openidConnect']?: ModuleOptions }
}


export { Config, CookieSerializeOptions, ModuleOptions, OidcProvider, default } from './module'
