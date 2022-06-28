<template>
  <div>
    Nuxt module playground!
  </div>
</template>

<script setup>
const { $oidc } = useNuxtApp()

if (process.client) {
  const user = $oidc.user
  console.log(user)
}

</script>

<script>
export default {
  data: () => {
    return {
    }
  },
  rendered () {
    console.log('gggggg')
    const { $oidc } = useNuxtApp()
    console.log($oidc.user)
  },
  mounted () {
    console.log('mounted...')
    //const { $oidc } = useNuxtApp()
    //console.log($oidc.state.user)
  }
}
</script>
