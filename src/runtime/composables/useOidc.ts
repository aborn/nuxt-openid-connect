import { useNuxtApp } from '#app'
import { type Oidc } from '../plugin'

export default function useOidc(): Oidc {
  return useNuxtApp().$oidc
}
