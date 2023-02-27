import { isUnset, isSet } from './utils/utils'

export type StorageOptions = {
  localStorage: boolean,
  prefix: string,
  ignoreExceptions: boolean
}

export class Storage {
  public options: StorageOptions
  private userInfoKey: string

  constructor(options: StorageOptions) {
    this.options = options
    this.userInfoKey = 'user'
  }

  getPrefix(): string {
    if (!this.options.localStorage) {
      throw new Error('Cannot get prefix; localStorage is off')
    }
    return this.options.prefix
  }

  setUserInfo(user: any) {
    if (isUnset(user)) {
      return
    }

    let _userValue = user
    if (typeof user !== 'string') {
      _userValue = JSON.stringify(user)
    }

    this.setLocalStorage(this.userInfoKey, _userValue)
  }

  getUserInfo(): any {
    if (this.isLocalStorageEnabled()) {
      const _user = this.getLocalStorage(this.userInfoKey) as string
      try {
        return JSON.parse(_user)
      } catch (err) {
        console.error('error in parse local user', err)
      }
    } else {
      return undefined
    }
  }

  removeUserInfo(): void {
    if (this.isLocalStorageEnabled()) {
      this.removeLocalStorage(this.userInfoKey)
    }
  }

  isLoggedIn(): boolean {
    const user = this.getUserInfo()
    return isSet(user) && Object.keys(user).length > 0
  }

  setLocalStorage(key: string, value: string): string | void {
    // Unset null, undefined
    if (isUnset(value)) {
      return this.removeLocalStorage(key)
    }

    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key

    try {
      localStorage.setItem(_key, value)
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        throw e
      }
    }

    return value
  }

  getLocalStorage(key: string): string | null {
    if (!this.isLocalStorageEnabled()) {
      return null
    }

    const _key = this.getPrefix() + key

    const value = localStorage.getItem(_key)

    return value
  }

  removeLocalStorage(key: string): void {
    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key
    localStorage.removeItem(_key)
  }

  // origin from https://github.com/nuxt-community/auth-module
  isLocalStorageEnabled(): boolean {
    // Local Storage only exists in the browser
    if (!process.client) {
      return false
    }

    // There's no great way to check if localStorage is enabled; most solutions
    // error out. So have to use this hacky approach :\
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const test = 'test'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        console.warn(
          "[AUTH] Local storage is enabled in config, but browser doesn't" +
          ' support it'
        )
      }
      return false
    }
  }
}
