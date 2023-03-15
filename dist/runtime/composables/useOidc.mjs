import { useNuxtApp } from "#app";
export default function useOidc() {
  return useNuxtApp().$oidc;
}
