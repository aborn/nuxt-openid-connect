import { defineNuxtPlugin } from '#app'

class Oidc {
  private state: {
    user: any,
    isLoggedIn: boolean
  }

  constructor() {
    this.state = { user: {}, isLoggedIn: false }
  }

  get user() {
    return this.state.user
  }

  get isLoggedIn() {
    return this.state.isLoggedIn
  }

  setUser(user: any) {
    this.state.user = user
    this.state.isLoggedIn = Object.keys(user).length > 0
  }

  async fetchUser() {
    const { data, pending, refresh, error } = await useFetch('/oidc/user')
    console.log(data.value)
    this.setUser(data.value)
    if (error && error.value) {
      console.error('tinyOidc failed to fetch user data: ', error.value)
      this.setUser({})
    }
  }

  login(redirect = '/') {
    console.log('login call...')
    if (process.client) {
      console.log('client here...')
      const params = new URLSearchParams({ redirect })
      const toStr = '/oidc/login' // + params.toString()
      console.log(toStr)
      window.location.replace(toStr)
    }
  }

  logout() {
    if (process.client) {
      window.location.replace('/oidc/logout')
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  console.log('Plugin by oidc!')
  const oidc = new Oidc()
  nuxtApp.provide('oidc', oidc)

  if (process.client) {
    oidc.fetchUser()
  }
})
