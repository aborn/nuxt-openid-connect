import { defineEventHandler, setCookie, useCookie } from 'h3'
import { CBT_PAGE_TEMPATE } from '../../../utils/template'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
  console.log('oidc/cbt calling')
  const { config } = useRuntimeConfig().openidConnect
  const res = event.res
  const html = CBT_PAGE_TEMPATE

  const sessionkey = config.secret
  const sessionid = useCookie(event, sessionkey)
  // console.log(sessionid)
  /* setCookie(event, sessionkey, sessionid, {
    maxAge: 24 * 60 * 60 // oneday
  }) */

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    Expires: new Date().toUTCString()
  })
  res.end(html)
})
