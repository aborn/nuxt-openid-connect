export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) { return }
  const { $oidc } = useNuxtApp()
  if (!$oidc.isLoggedIn) {
    $oidc.login(to.fullPath)
  }
})
