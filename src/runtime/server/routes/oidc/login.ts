import { defineEventHandler } from 'h3'

import { initClient } from '../../../utils/issueclient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  console.log('oidc/login calling')
  const { op } = useRuntimeConfig().openidConnect
  const issueClient = await initClient(op)

  const req = event.req
  console.log(req.url)
  const res = event.res

  const parameters = {
    redirect_uri: op.callbackUrl,
    response_type: 'id_token',
    scope: ['openid'].concat(op.scope).join(' ') // 'openid'
  }
  const authUrl = issueClient.authorizationUrl(parameters)
  console.log(authUrl)

  res.writeHead(302, { Location: authUrl })
  res.end()
})
