<template>
  <div>
    <NavBar />
    <main class="container">
      <h1> Secure Page </h1>
      <b-alert show variant="success">
        Secured content
        You should see this page <b> only if authenticated!</b>
      </b-alert>
    </main>
  </div>
</template>

<script lang="ts" setup>
const { $oidc } = useNuxtApp()
if(!$oidc.isLoggedIn) {
  navigateTo('/401');
}
</script>
