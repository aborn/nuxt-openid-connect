import { Buffer } from 'buffer'
const algorithm = 'aes-256-ctr'
const ENCRYPTION_KEY = Buffer.from('bf3c199c2470cb477d907b1e0917c17b1234567890e=', 'base64')
const IV_LENGTH = 16

export const encrypt = async (text: string) => {
  const crypto = await import('node:crypto')
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = async (text: string) => {
  const crypto = await import('node:crypto')
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift(), 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
