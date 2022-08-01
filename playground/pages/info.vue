<template>
  <div>
    <NavBar />
    <main class="container">
      <div>
        Nuxt OpenID-Connect playground!
      </div>
      <div>isLoggedIn: {{ $oidc.isLoggedIn }}</div>
      <div>user: {{ $oidc.user }}</div>
      <button v-if="!$oidc.isLoggedIn" @click="$oidc.login()">
        Login
      </button>
      <button v-else @click="$oidc.logout()">
        Logout
      </button>
    </main>
  </div>
</template>

<script setup>
// alternatively, you can also use it here
const { $oidc } = useNuxtApp()
console.log('here is 20 line..')
console.log('isLogIn:', $oidc.isLoggedIn)
// const user = useState('useState')
</script>
