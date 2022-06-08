import { defineNuxtConfig } from 'nuxt'
import openidConnect from '..'

export default defineNuxtConfig({
  modules: [
    openidConnect
  ],
  openidConnect: {
    addPlugin: true
  }
})
