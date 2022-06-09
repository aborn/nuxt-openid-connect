import { defineNuxtPlugin } from '#app'

interface UseState {
  user: any,
  isLoggedIn: boolean
}
class Oidc {
  private state: UseState
  private useStateLocal: any

  constructor () {
    // this.state = { user: {}, isLoggedIn: false }
    this.useStateLocal = useState<UseState>('useState', () => { return { user: {}, isLoggedIn: false } })
    this.state = { user: {}, isLoggedIn: false }
  }

  get user () {
    const userState = this.useStateLocal.value.user
    return userState
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
