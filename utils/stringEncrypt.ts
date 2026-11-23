import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt
} from 'node:crypto'

const VERSION = 'v1'
const SALT_LEN = 16
const IV_LEN = 12
const KEY_LEN = 32
// KDF 参数随版本固化，不要运行时改动；要升级就开 v2
// N=2^15, r=8 需要 32MiB，正好顶到 Node 默认 maxmem 上限，需显式放宽
const KDF = { N: 2 ** 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }

const deriveKey = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, KEY_LEN, KDF, (err, key) =>
      err ? reject(err) : resolve(key)
    )
  )

export const encryptString = async (password: string, plain: string) => {
  const salt = randomBytes(SALT_LEN)
  const iv = randomBytes(IV_LEN)
  const key = await deriveKey(password, salt)

  const cipher = createCipheriv('aes-256-gcm', key, iv)
  cipher.setAAD(Buffer.from(VERSION)) // 绑定版本，防密文被换到别的语义上
  const ciphertext = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final()
  ])

  return [VERSION, salt, iv, cipher.getAuthTag(), ciphertext]
    .map(part => (typeof part === 'string' ? part : part.toString('base64')))
    .join(':')
}

export const decryptString = async (password: string, payload: string) => {
  const [version, saltB64, ivB64, tagB64, cipherB64] = payload.split(':')

  if (version !== VERSION) throw new Error(`不支持的密文版本: ${version}`)

  const key = await deriveKey(password, Buffer.from(saltB64, 'base64'))

  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(ivB64, 'base64')
  )
  decipher.setAAD(Buffer.from(VERSION))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'))

  try {
    return Buffer.concat([
      decipher.update(Buffer.from(cipherB64, 'base64')),
      decipher.final()
    ]).toString('utf8')
  } catch {
    // 密码错误 / 密文损坏 / 参数不匹配，都在 final() 这一步暴露
    throw new Error('密码错误或密文已损坏')
  }
}
