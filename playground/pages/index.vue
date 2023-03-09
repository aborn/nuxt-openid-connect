<template>
  <div>
    <NavBar />
    <main class="container">
      <h3>Welcome to nuxt-openid-connect module example</h3>
      This demo is using nuxt-openid-connect v{{ version }}
      <div class="mt-1">
        <template v-if="$oidc.isLoggedIn">
          <button class="ml-3" variant="info" to="/secure">
            Secure
          </button>
          <button class="ml-3" variant="danger" @click="$oidc.logout()">
            Logout
          </button>
        </template>
        <button v-else variant="success" @click="$oidc.login('/secure')">
          Login
        </button>
      </div>

      <div>
        User status:
        <span>{{ $oidc.isLoggedIn ? 'Logged In' : 'Guest' }}</span>
      </div>
    </main>
  </div>
</template>

<script setup>
import { version } from '../../package.json'

// Access the plugin through the composable
const oidc = useOidc()
// Or through injected variable
const { $oidc } = useNextApp()
console.log('(composable) isLoggedIn:', oidc.isLoggedIn)
console.log('(injected) isLoggedIn:', $oidc.isLoggedIn)
</script>
