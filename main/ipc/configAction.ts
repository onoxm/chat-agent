import { CHANNELS } from '@types'
import {
  app,
  BrowserWindow,
  dialog,
  type IpcMainInvokeEvent,
  type OpenDialogOptions
} from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

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

export const exportConfig = {
  channel: CHANNELS.EXPORT_CONFIG,
  handle: async (event: IpcMainInvokeEvent, dir: string, config: unknown) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    const options = {
      title: '导出配置',
      defaultPath: path.join(dir || app.getPath('documents'), 'config.json'),
      filters: [{ name: 'JSON', extensions: ['json'] }]
    }

    const { canceled, filePath } = win
      ? await dialog.showSaveDialog(win, options)
      : await dialog.showSaveDialog(options)

    if (canceled || !filePath) return ''

    await writeFile(filePath, JSON.stringify(config, null, 2), 'utf8')

    return filePath
  }
}
