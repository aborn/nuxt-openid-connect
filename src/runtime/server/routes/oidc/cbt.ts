import { defineEventHandler } from 'h3'
import { CBT_PAGE_TEMPATE } from '../../../utils/template'

export default defineEventHandler((event) => {
  console.log('oidc/cbt calling')
  const res = event.res
  const html = CBT_PAGE_TEMPATE
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': html.length,
    Expires: new Date().toUTCString()
  })
  res.end(html)
})
