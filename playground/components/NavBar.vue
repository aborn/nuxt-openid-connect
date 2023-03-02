<template>
  <nav class="container-fluid">
    <ul>
      <li>
        <NuxtLink to="/" aria-label="Back home">
          Nuxt-Openid-Connect
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/" class="first">
          Home
        </NuxtLink>
      </li>
    </ul>
    <ul>
      <li>
        <NuxtLink to="/public" class="secondary">
          Public
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/secure" class="secondary">
          Secure
        </NuxtLink>
      </li>
      <li>
        <NuxtLink v-if="$oidc.isLoggedIn" to="/secure" class="contrast" aria-label="My files">
          <img :src="$oidc.user.avatar" style="height:50px;max-width:100%;border-radius: 50%;">
          <span>{{ $oidc.user.name }}</span>
        </NuxtLink>
        <button v-else @click="$oidc.login()">
          login
        </button>
      </li>
    </ul>
  </nav>
</template>
