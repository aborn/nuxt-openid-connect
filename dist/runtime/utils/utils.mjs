export const isUnset = (o) => typeof o === "undefined" || o === null;
export const isSet = (o) => !isUnset(o);
export const getRedirectUrl = (uri) => {
  if (!uri) {
    return "/";
  }
  const idx = uri.indexOf("?");
  const searchParams = new URLSearchParams(idx >= 0 ? uri.substring(idx) : uri);
  return searchParams.get("redirect") || "/";
};
export function getCallbackUrl(callbackUrl, redirectUrl, host) {
  if (callbackUrl && callbackUrl.length > 0) {
    return callbackUrl.includes("?") ? callbackUrl + "&redirect=" + redirectUrl : callbackUrl + "?redirect=" + redirectUrl;
  } else {
    return getDefaultBackUrl(redirectUrl, host);
  }
}
export function getDefaultBackUrl(redirectUrl, host) {
  return "http://" + host + "/oidc/cbt?redirect=" + redirectUrl;
}
export function getResponseMode(config) {
  const responseType = config.response_type;
  return config.response_mode || getDefaultResponseMode(responseType);
}
function getDefaultResponseMode(responseType) {
  const resTypeArray = responseType.match(/[^ ]+/g);
  if (resTypeArray && resTypeArray?.findIndex((i) => i === "code") >= 0) {
    return "query";
  } else if (resTypeArray && resTypeArray?.findIndex((i) => i === "token")) {
    return "fragment";
  }
  return "query";
}
