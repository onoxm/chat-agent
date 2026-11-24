import { windowManager } from '@main/window'
import { CHANNELS, type CommunicationType, type WindowName } from '@types'
import {
  BrowserWindow,
  type IpcMainEvent,
  type IpcMainInvokeEvent
} from 'electron'

export const syncWindowState = {
  channel: CHANNELS.SEND_WINDOW_STATE,
  handle: (
    _: IpcMainEvent,
    targetWindow: WindowName | 'all',
    type: CommunicationType,
    state: any
  ) => {
    if (targetWindow === 'all')
      return windowManager.getAllWindows().forEach(window => {
        window.webContents.send(CHANNELS.ON_WINDOW_STATE, {
          type,
          data: state
        })
      })

    if (!windowManager.hasWindow(targetWindow)) return
    windowManager
      .getWindow(targetWindow)!
      .webContents.send(CHANNELS.ON_WINDOW_STATE, { type, data: state })
  }
}

export const getCurrentWindowState = {
  channel: CHANNELS.GET_CURRENT_WINDOW_STATE,
  handle: (event: IpcMainInvokeEvent, state: string) => {
    const win = BrowserWindow.fromWebContents(event.sender)

    switch (state) {
      case 'maximized':
        return win?.isMaximized()
    }
  }
}
