import { isUnset, isSet } from "./utils/utils.mjs";
export class Storage {
  constructor(options) {
    this.options = options;
    this.userInfoKey = "user";
  }
  getPrefix() {
    if (!this.options.localStorage) {
      throw new Error("Cannot get prefix; localStorage is off");
    }
    return this.options.prefix;
  }
  setUserInfo(user) {
    if (isUnset(user)) {
      return;
    }
    let _userValue = user;
    if (typeof user !== "string") {
      _userValue = JSON.stringify(user);
    }
    this.setLocalStorage(this.userInfoKey, _userValue);
  }
  getUserInfo() {
    if (this.isLocalStorageEnabled()) {
      const _user = this.getLocalStorage(this.userInfoKey);
      try {
        return JSON.parse(_user);
      } catch (err) {
        console.error("error in parse local user", err);
      }
    } else {
      return void 0;
    }
  }
  removeUserInfo() {
    if (this.isLocalStorageEnabled()) {
      this.removeLocalStorage(this.userInfoKey);
    }
  }
  isLoggedIn() {
    const user = this.getUserInfo();
    return isSet(user) && Object.keys(user).length > 0;
  }
  setLocalStorage(key, value) {
    if (isUnset(value)) {
      return this.removeLocalStorage(key);
    }
    if (!this.isLocalStorageEnabled()) {
      return;
    }
    const _key = this.getPrefix() + key;
    try {
      localStorage.setItem(_key, value);
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        throw e;
      }
    }
    return value;
  }
  getLocalStorage(key) {
    if (!this.isLocalStorageEnabled()) {
      return null;
    }
    const _key = this.getPrefix() + key;
    const value = localStorage.getItem(_key);
    return value;
  }
  removeLocalStorage(key) {
    if (!this.isLocalStorageEnabled()) {
      return;
    }
    const _key = this.getPrefix() + key;
    localStorage.removeItem(_key);
  }
  // origin from https://github.com/nuxt-community/auth-module
  isLocalStorageEnabled() {
    if (!process.client) {
      return false;
    }
    const test = "test";
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      if (!this.options.ignoreExceptions) {
        console.warn(
          "[AUTH] Local storage is enabled in config, but browser doesn't support it"
        );
      }
      return false;
    }
  }
}
