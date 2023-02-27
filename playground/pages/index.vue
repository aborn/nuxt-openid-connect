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
// alternatively, you can also use it here
import { version } from '../../package.json'
const { $oidc } = useNuxtApp()
console.log('here is 33 line..')
console.log('isLogIn:', $oidc.isLoggedIn)
// const user = useState('useState')
</script>
