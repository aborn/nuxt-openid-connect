import { useRuntimeConfig } from '#imports';

const debug = useRuntimeConfig().openidConnect.config.debug ?? false

export const CBT_PAGE_TEMPATE = `
<!DOCTYPE html>
<html>

<body>

  <h1>OIDC Callback Middle Page. Loading...</h1>

  <script>
    const hash = window.location.hash
    `+ (debug ? `console.log(hash)` : ``) + `
    if (hash.length > 0 && hash.includes('#')) {
      window.location.replace(window.location.href.replace('cbt#', 'callback?'))
    }

  </script>
</body>

</html>
`
