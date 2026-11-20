import { createSettingsWindow } from '@main/window'
import { CHANNELS, type WindowName } from '@types'
import { IpcMainEvent } from 'electron'

export const createWindow = {
  channel: CHANNELS.CREATE_WINDOW,
  handle: (_: IpcMainEvent, windowName: WindowName) => {
    switch (windowName) {
      case 'settings':
        createSettingsWindow()
        break
    }
  }
}
