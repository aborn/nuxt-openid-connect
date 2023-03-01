export const isUnset = (o: unknown): boolean =>
  typeof o === 'undefined' || o === null

export const isSet = (o: unknown): boolean => !isUnset(o)

export const getRedirectUrl = (uri: string | null | undefined): string => {
  if (!uri) {
    return '/'
  }
  const idx = uri.indexOf('?')
  const searchParams = new URLSearchParams(idx >= 0 ? uri.substring(idx) : uri)
  return searchParams.get('redirect') || '/'
}

export function getCallbackUrl(callbackUrl: string, redirectUrl: string, host: string | undefined): string {
  if ((callbackUrl && callbackUrl.length > 0)) {
    return callbackUrl.includes('?') ? (callbackUrl + '&redirect=' + redirectUrl) : (callbackUrl + '?redirect=' + redirectUrl)
  } else {
    return getDefaultBackUrl(redirectUrl, host)
  }
}

export function getDefaultBackUrl(redirectUrl: string, host: string | undefined): string {
  return 'http://' + host + '/oidc/cbt?redirect=' + redirectUrl
}
