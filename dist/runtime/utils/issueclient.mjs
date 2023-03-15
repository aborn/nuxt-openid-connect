import { Issuer } from "openid-client";
import { logger } from "./logger.mjs";
import { useRuntimeConfig } from "#imports";
export const initClient = async (op, req, redirectUris) => {
  const { config } = useRuntimeConfig().openidConnect;
  const issuer = await Issuer.discover(op.issuer);
  logger.trace("Discovered issuer %s %O", issuer.issuer, issuer.metadata);
  const client = new issuer.Client({
    client_id: op.clientId,
    client_secret: op.clientSecret,
    redirect_uris: redirectUris,
    response_type: config.response_type
    // id_token_signed_response_alg (default "RS256")
  });
  return client;
};
