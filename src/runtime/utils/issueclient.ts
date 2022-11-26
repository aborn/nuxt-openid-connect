import { Issuer } from 'openid-client'
import { OidcProvider } from '../../module'
import { useRuntimeConfig } from "#imports";

export const initClient = async (op: OidcProvider, req: any) => {
  const { config } = useRuntimeConfig().openidConnect
  const host = req?.headers?.host
  const callbackUrl = host ? 'http://' + host + '/oidc/cbt' : op.callbackUrl

  const issuer = await Issuer.discover(op.issuer)
  // console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata)
  const client = new issuer.Client({
    client_id: op.clientId,
    client_secret: op.clientSecret,
    redirect_uris: [callbackUrl],
    response_type: config.response_type
    // id_token_signed_response_alg (default "RS256")
  }) // => Client

  return client
}
