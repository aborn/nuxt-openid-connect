import { defineEventHandler, getCookie } from "h3";
import { logger } from "@nuxt/kit";
import { CBT_PAGE_TEMPATE } from "../../../utils/template.mjs";
import { useRuntimeConfig } from "#imports";
export default defineEventHandler((event) => {
  logger.debug("[CBT]: oidc/cbt calling");
  const { config } = useRuntimeConfig().openidConnect;
  const res = event.node.res;
  const html = CBT_PAGE_TEMPATE;
  const sessionkey = config.secret;
  const sessionid = getCookie(event, sessionkey);
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": html.length,
    Expires: (/* @__PURE__ */ new Date()).toUTCString()
  });
  res.end(html);
});
