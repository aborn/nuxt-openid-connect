import { defineNuxtPlugin } from '#app'
import { Storage, StorageOptions } from './storage'
import { isUnset, isSet } from './utils/utils'
import { useState, useFetch } from '#imports'

interface UseState {
  user: any,
  isLoggedIn: boolean
}
class Oidc {
  private state: UseState
  private useStateLocal: any
  public $storage: Storage

  constructor () {
    // this.state = { user: {}, isLoggedIn: false }
    this.useStateLocal = useState<UseState>('useState', () => { return { user: {}, isLoggedIn: false } })
    const storageOption = {
      localStorage: true,
      prefix: 'oidc.',
      ignoreExceptions: true
    }
    const storage = new Storage(storageOption)
    this.$storage = storage
    this.state = { user: {}, isLoggedIn: false }
  }

  get user () {
    const userState = this.useStateLocal.value.user
    if ((isUnset(userState) || Object.keys(useState).length === 0) && this.$storage.isLocalStorageEnabled()) {
      const _user = this.$storage.getLocalStorage('user')
      const user = JSON.parse(_user)
      // console.log('load user from Browser.localStorge', user)
      return user
    } else {
      // console.log('load user from Vue.useState', userState)
      return userState
    }
    // return this.state.user  // not auto update
  }

  get isLoggedIn () {
    const isLoggedIn = this.useStateLocal.value.isLoggedIn
    // return this.state.isLoggedIn  // not auto update
    return isLoggedIn
  }

  setUser (user: any) {
    this.state.user = user
    this.state.isLoggedIn = Object.keys(user).length > 0

    this.useStateLocal.value.user = user
    this.useStateLocal.value.isLoggedIn = Object.keys(user).length > 0
    this.$storage.setLocalStorage('user', JSON.stringify(user))
  }

  async fetchUser () {
    try {
      const { data, pending, refresh, error } = await useFetch('/oidc/user')
      // console.log(data.value)
      this.setUser(data.value)
      if (error && error.value) {
        console.error('tinyOidc failed to fetch user data: ', error.value)
        this.setUser({})
      }
    } catch (err) {
      console.log('error')
    }
  }

  login (redirect = '/') {
    if (process.client) {
      const params = new URLSearchParams({ redirect })
      const toStr = '/oidc/login' // + params.toString()
      console.log(toStr)
      window.location.replace(toStr)
    }
  }

  logout () {
    if (process.client) {
      window.location.replace('/oidc/logout')
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Plugin by nuxt-openid-connect!')
  const oidc = new Oidc()
  nuxtApp.provide('oidc', oidc)

  if (process.client) {
    oidc.fetchUser()
  }
})
