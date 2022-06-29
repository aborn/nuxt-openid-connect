import { isUnset, isSet } from './utils/utils'

export type StorageOptions = {
    localStorage: boolean,
    prefix: string,
    ignoreExceptions: boolean
}

export class Storage {
  public options: StorageOptions

  constructor (options: StorageOptions) {
    this.options = options
  }

  getPrefix (): string {
    if (!this.options.localStorage) {
      throw new Error('Cannot get prefix; localStorage is off')
    }
    return this.options.prefix
  }

  getUserInfo (): any {
    if (this.isLocalStorageEnabled()) {
      const _user = this.getLocalStorage('user')
      try {
        return JSON.parse(_user)
      } catch (err) {
        console.error('error in parse local user', err)
      }
    } else {
      return undefined
    }
  }

  isLoggedIn (): boolean {
    return isSet(this.getUserInfo())
  }

  setLocalStorage (key: string, value: string): string | void {
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

  getLocalStorage (key: string): string {
    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key

    const value = localStorage.getItem(_key)

    return value
  }

  removeLocalStorage (key: string): void {
    if (!this.isLocalStorageEnabled()) {
      return
    }

    const _key = this.getPrefix() + key
    localStorage.removeItem(_key)
  }

  // origin from https://github.com/nuxt-community/auth-module
  isLocalStorageEnabled (): boolean {
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
        // eslint-disable-next-line no-console
        console.warn(
          "[AUTH] Local storage is enabled in config, but browser doesn't" +
                    ' support it'
        )
      }
      return false
    }
  }
}
