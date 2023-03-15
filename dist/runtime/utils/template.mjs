import { useRuntimeConfig } from "#imports";
const debug = useRuntimeConfig().openidConnect.config.debug ?? false;
export const CBT_PAGE_TEMPATE = `
<!DOCTYPE html>
<html>

<body>

  <h1>OIDC Callback Middle Page. Loading...</h1>

  <script>
    const hash = window.location.hash
    if (window.location.href.includes('cbt#')) {
      window.location.replace(window.location.href.replace('cbt#', 'callback?'))
    } else if (window.location.href.includes('cbt?redirect')) {
      window.location.replace(window.location.href.replace('/cbt?', '/callback?').replace('#', "&"))
    }
  <\/script>
</body>

</html>
`;
