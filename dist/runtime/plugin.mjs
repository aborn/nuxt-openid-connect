import { defineNuxtPlugin } from "#app";
import { Storage } from "./storage.mjs";
import { isUnset, isSet } from "./utils/utils.mjs";
import { decrypt } from "./utils/encrypt.mjs";
import { useState, useFetch, useRuntimeConfig, useCookie } from "#imports";
export class Oidc {
  // LocalStorage: Browser.localStorage （share state in all sites, use in page refresh.）
  constructor() {
    this.state = { user: {}, isLoggedIn: false };
    this.$useState = useState("useState", () => {
      return { user: {}, isLoggedIn: false };
    });
    const { config } = useRuntimeConfig()?.public?.openidConnect;
    const storageOption = {
      localStorage: true,
      prefix: config.cookiePrefix,
      ignoreExceptions: true
    };
    const storage = new Storage(storageOption);
    this.$storage = storage;
  }
  get user() {
    const userInfoState = this.$useState.value.user;
    const userInfoLS = this.$storage.getUserInfo();
    if (isUnset(userInfoState)) {
      return userInfoLS;
    } else {
      return userInfoState;
    }
  }
  get isLoggedIn() {
    const isLoggedIn = this.$useState.value.isLoggedIn;
    const isLoggedInLS = this.$storage.isLoggedIn();
    return isLoggedIn || isLoggedInLS;
  }
  setUser(user) {
    this.state.user = user;
    this.state.isLoggedIn = Object.keys(user).length > 0;
    this.$useState.value.user = user;
    this.$useState.value.isLoggedIn = Object.keys(user).length > 0;
    this.$storage.setUserInfo(user);
  }
  async fetchUser() {
    try {
      if (process.server) {
        const { config } = useRuntimeConfig()?.public?.openidConnect;
        const userinfoCookie = useCookie(config.cookiePrefix + "user_info");
        if (isSet(userinfoCookie) && userinfoCookie.value) {
          const userInfoStr = await decrypt(userinfoCookie.value, config);
          if (userInfoStr) {
            const userinfo = JSON.parse(userInfoStr);
            this.setUser(userinfo);
          } else {
            console.error("userInfoStr undefined!");
          }
        } else {
          this.setUser({});
        }
      } else {
        const { data, pending, refresh, error } = await useFetch("/oidc/user");
        this.setUser(data.value);
        if (error && error.value) {
          console.error("failed to fetch user data: ", error.value);
          this.setUser({});
        }
      }
    } catch (err) {
      console.error("@plugin.fetchUser error", err);
    }
  }
  login(redirect = "/") {
    if (process.client) {
      const params = new URLSearchParams({ redirect });
      const toStr = "/oidc/login?" + params.toString();
      window.location.replace(toStr);
    }
  }
  logout() {
    if (process.client) {
      this.$useState.value.user = {};
      this.$useState.value.isLoggedIn = false;
      this.$storage.removeUserInfo();
      window.location.replace("/oidc/logout");
    }
  }
}
export default defineNuxtPlugin((nuxtApp) => {
  const oidc = new Oidc();
  nuxtApp.provide("oidc", oidc);
  oidc.fetchUser();
});
