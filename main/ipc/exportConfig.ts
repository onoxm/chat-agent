import { CHANNELS } from '@types'
import { app, BrowserWindow, dialog, type IpcMainInvokeEvent } from 'electron'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

export const exportConfig = {
  channel: CHANNELS.EXPORT_CONFIG,
  handle: async (
    event: IpcMainInvokeEvent,
    dir: string,
    config: unknown,
    filename: string
  ) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    const options = {
      title: '导出配置',
      defaultPath: path.join(dir || app.getPath('documents'), filename),
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
