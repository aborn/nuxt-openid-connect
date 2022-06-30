<template>
  <div>
    Nuxt module playground!
    <div>
      {{ $oidc.user }}
    </div>
  </div>
</template>

<script setup>
const { $oidc } = useNuxtApp()

const user = $oidc.user
console.log(user)

const url = 'http://localhost:18080/api/mindpress/demo'

const { data: dataServer } = await useFetch(url,
  {
    key: 't' + new Date(),
    headers: { uid: 'aborn' }
  })
console.log(dataServer.value)

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
    const { $oidc } = useNuxtApp()
    console.log($oidc.user)
  }
}
</script>
