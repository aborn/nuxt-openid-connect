import { defineNuxtPlugin } from '#app'
import { Storage, StorageOptions } from './storage'
import { isUnset, isSet } from './utils/utils'
import { encrypt, decrypt } from './utils/encrypt'
import { useState, useFetch, useRuntimeConfig, useCookie } from '#imports'

interface UseState {
  user: any,
  isLoggedIn: boolean
}

export class Oidc {
  private state: UseState // only this plugin.
  private $useState: any // State: Nuxt.useState (share state in all nuxt pages and components) https://v3.nuxtjs.org/guide/features/state-management
  public $storage: Storage // LocalStorage: Browser.localStorage （share state in all sites, use in page refresh.）

  constructor() {
    this.state = { user: {}, isLoggedIn: false }

    this.$useState = useState<UseState>('useState', () => { return { user: {}, isLoggedIn: false } })
    const { config } = useRuntimeConfig()?.public?.openidConnect

    const storageOption = {
      localStorage: true,
      prefix: config.cookiePrefix,
      ignoreExceptions: true
    }
    const storage = new Storage(storageOption)
    this.$storage = storage
  }

  get user() {
    const userInfoState = this.$useState.value.user
    const userInfoLS = this.$storage.getUserInfo()
    if ((isUnset(userInfoState))) {
      // console.log('load user from Browser.localStorge', userInfoState)
      return userInfoLS
    } else {
      // console.log('load user from Nuxt.useState', userInfoState)
      return userInfoState
    }
    // return this.state.user  // not auto update
  }

  get isLoggedIn() {
    const isLoggedIn = this.$useState.value.isLoggedIn
    const isLoggedInLS = this.$storage.isLoggedIn()
    // console.log('isLoggedIn', isLoggedIn, isLoggedInLS)
    return isLoggedIn || isLoggedInLS
  }

  setUser(user: any) {
    this.state.user = user
    this.state.isLoggedIn = Object.keys(user).length > 0

    this.$useState.value.user = user
    this.$useState.value.isLoggedIn = Object.keys(user).length > 0

    this.$storage.setUserInfo(user)
  }

  async fetchUser() {
    try {
      if (process.server) {
        // console.log('serve-render: fetchUser from cookie.')
        const { config } = useRuntimeConfig()?.openidConnect
        const userinfoCookie = useCookie(config.cookiePrefix + 'user_info')
        if (isSet(userinfoCookie) && userinfoCookie.value) {
          const userInfoStr = await decrypt(userinfoCookie.value, config)
          if (userInfoStr) {
            const userinfo = JSON.parse(userInfoStr)
            this.setUser(userinfo)
          } else {
            console.error('userInfoStr undefined!')
          }
        } else {
          // console.log('empty cookie')
          this.setUser({})
        }
      } else {
        // this.$useState.value.user is set by server, and pass to client ? how achived it ?
        // console.log('client-render: fetchUser from server.')
        const { data, pending, refresh, error } = await useFetch('/oidc/user')
        this.setUser(data.value)
        // console.log('fetchUser from server-api call.', data.value)
        if (error && error.value) {
          console.error('failed to fetch user data: ', error.value)
          this.setUser({})
        }
      }
    } catch (err) {
      console.error('@plugin.fetchUser error', err)
    }
  }

  login(redirect = '/') {
    if (process.client) {
      const params = new URLSearchParams({ redirect })
      const toStr = '/oidc/login?' + params.toString()
      window.location.replace(toStr)
    }
  }

  logout() {
    // TODO clear user info when accessToken expired.
    if (process.client) {
      this.$useState.value.user = {}
      this.$useState.value.isLoggedIn = false

      this.$storage.removeUserInfo()
      window.location.replace('/oidc/logout')
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // TODO: enable consola debug mode here instead of console.log
  // console.log('--- Nuxt plugin: nuxt-openid-connect!')
  const oidc = new Oidc()
  nuxtApp.provide('oidc', oidc)
  // console.log('--- Nuxt plugin: DEBUG MODE:' + useNuxtApp().ssrContext?.runtimeConfig.openidConnect.config.debug);
  oidc.fetchUser() // render both from server and client.
})
