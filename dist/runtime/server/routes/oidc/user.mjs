import { getCookie, deleteCookie, defineEventHandler } from "h3";
import { initClient } from "../../../utils/issueclient.mjs";
import { encrypt, decrypt } from "../../../utils/encrypt.mjs";
import { logger } from "../../../utils/logger.mjs";
import { useRuntimeConfig } from "#imports";
export default defineEventHandler(async (event) => {
  const { config, op } = useRuntimeConfig().openidConnect;
  logger.debug("[USER]: oidc/user calling");
  logger.trace("[USER]: " + event.req.headers.cookie);
  const sessionid = getCookie(event, config.secret);
  const accesstoken = getCookie(event, config.cookiePrefix + "access_token");
  const userinfoCookie = getCookie(event, config.cookiePrefix + "user_info");
  if (userinfoCookie) {
    const userInfoStr = await decrypt(userinfoCookie, config);
    return JSON.parse(userInfoStr ?? "");
  } else if (accesstoken) {
    try {
      const issueClient = await initClient(op, event.node.req, []);
      const userinfo = await issueClient.userinfo(accesstoken);
      try {
        const encryptedText = await encrypt(JSON.stringify(userinfo), config);
        setCookie(event, config.cookiePrefix + "user_info", encryptedText, { ...config.cookieFlags["user_info"] });
      } catch (err) {
        logger.error("encrypted userinfo error.", err);
      }
      return userinfo;
    } catch (err) {
      logger.error("[USER]: " + err);
      deleteCookie(event, config.secret);
      deleteCookie(event, config.cookiePrefix + "access_token");
      deleteCookie(event, config.cookiePrefix + "user_info");
      const cookie = config.cookie;
      if (cookie) {
        for (const [key, value] of Object.entries(cookie)) {
          deleteCookie(event, config.cookiePrefix + key);
        }
      }
      return {};
    }
  } else {
    logger.debug("[USER]: empty accesstoken for access userinfo");
    return {};
  }
});
