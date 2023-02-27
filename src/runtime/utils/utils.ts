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
