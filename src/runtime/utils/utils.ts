export const isUnset = (o: unknown): boolean =>
  typeof o === 'undefined' || o === null

export const isSet = (o: unknown): boolean => !isUnset(o)
