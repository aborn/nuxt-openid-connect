const KEY = 'bfnuxt9c2470cb477d907b1e0917oidc' // 32
const IV = 'ab83667c72eec9e4' // 16
const ALGO = 'aes-256-cbc'

// TODO KEY and IV can config.
export const encrypt = async (text: string) => {
  const crypto = await import('node:crypto')
  const cipher = crypto.createCipheriv(ALGO, KEY, IV)
  let encrypted = cipher.update(text, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export const decrypt = async (text: string) => {
  if (!text) { return }
  const crypto = await import('node:crypto')

  const decipher = crypto.createDecipheriv(ALGO, KEY, IV)
  const decrypted = decipher.update(text, 'base64', 'utf8')
  return (decrypted + decipher.final('utf8'))
}
