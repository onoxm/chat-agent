import { CHANNELS } from '@types'
import {
  app,
  BrowserWindow,
  dialog,
  type IpcMainInvokeEvent,
  type OpenDialogOptions
} from 'electron'
import { readFile } from 'node:fs/promises'

export const importConfig = {
  channel: CHANNELS.IMPORT_CONFIG,
  handle: async (event: IpcMainInvokeEvent) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    const options: OpenDialogOptions = {
      title: '导入配置',
      defaultPath: app.getPath('desktop'),
      properties: ['openFile'],
      filters: [{ name: 'JSON', extensions: ['json'] }]
    }

    const { canceled, filePaths } = win
      ? await dialog.showOpenDialog(win, options)
      : await dialog.showOpenDialog(options)

    if (canceled || filePaths.length === 0) return null

    const content = await readFile(filePaths[0], 'utf8')

    return JSON.parse(content)
  }
}
