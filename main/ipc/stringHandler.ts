import { CHANNELS } from '@types'
import { safeStorage, type IpcMainInvokeEvent } from 'electron'

export const encryptStr = {
  channel: CHANNELS.ENCRYPT_STR,
  handle: async (_: IpcMainInvokeEvent, str: string) => {
    if (!(await safeStorage.isAsyncEncryptionAvailable())) {
      throw new Error('OS encryption is not available on this system.')
    }

    const encryptedBuffer = await safeStorage.encryptStringAsync(str)

    return encryptedBuffer.toString('base64')
  }
}

export const decryptStr = {
  channel: CHANNELS.DECRYPT_STR,
  handle: async (_: IpcMainInvokeEvent, str: string) => {
    try {
      if (!(await safeStorage.isAsyncEncryptionAvailable())) {
        throw new Error('OS encryption is not available on this system.')
      }

      const encryptedBuffer = Buffer.from(str, 'base64')

      // 解密，从返回的对象的 result 属性取明文
      const { result, shouldReEncrypt } =
        await safeStorage.decryptStringAsync(encryptedBuffer)

      // 如果系统提示需要重新加密，可以在这里触发一次静默的 saveApiKey(result)
      if (shouldReEncrypt) {
        // 注意：这里需要谨慎，避免在启动路径上引入额外的写操作风险
        console.log('Key rotation suggested by safeStorage.')
      }

      return result
    } catch (e) {
      console.error(e)
      return ''
    }
  }
}
