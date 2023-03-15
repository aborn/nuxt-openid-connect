export const encrypt = async (text, config) => {
  const KEY = config.cookieEncryptKey;
  const IV = config.cookieEncryptIV;
  const ALGO = config.cookieEncryptALGO;
  const NEED_ENCRYPT = config.cookieEncrypt;
  if (!NEED_ENCRYPT) {
    return text;
  }
  const crypto = await import("node:crypto");
  const cipher = crypto.createCipheriv(ALGO, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
export const decrypt = async (text, config) => {
  const KEY = config.cookieEncryptKey;
  const IV = config.cookieEncryptIV;
  const ALGO = config.cookieEncryptALGO;
  const NEED_ENCRYPT = config.cookieEncrypt;
  if (!text) {
    return;
  }
  if (!NEED_ENCRYPT) {
    return text;
  }
  const crypto = await import("node:crypto");
  const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
  const decrypted = decipher.update(text, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
