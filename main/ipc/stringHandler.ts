import { CHANNELS } from '@types'
import { decryptString, encryptString } from '@utils'
import { type IpcMainInvokeEvent } from 'electron'

const password = 'abcd123456'

export const encryptStr = {
  channel: CHANNELS.ENCRYPT_STR,
  handle: async (_: IpcMainInvokeEvent, str: string) => {
    if (!str) return ''

    return encryptString(password, str)
  }
}

export const decryptStr = {
  channel: CHANNELS.DECRYPT_STR,
  handle: async (_: IpcMainInvokeEvent, str: string) => {
    if (!str) return ''

    return await decryptString(password, str)
  }
}
