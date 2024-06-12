<template>
  <div>
    <NavBar />
    <main class="container">
      <div>
        Nuxt module playground!
        {{ $oidc.user }}
      </div>
    </main>
  </div>
</template>

<script setup>
const { $oidc } = useNuxtApp()
const user = $oidc.user

const uid = user ? user.sub : ''
const url = 'http://localhost:18080/api/mindpress/demo'
const { data: dataServer } = await useFetch(url,
  {
    headers: { uid }
  })
console.log(dataServer.value)

</script>

<script>
export default {
  data: () => {
    return {
    }
  },
  mounted() {
    console.log('mounted...')
    const { $oidc } = useNuxtApp()
    console.log($oidc.user)
  }
}
</script>
