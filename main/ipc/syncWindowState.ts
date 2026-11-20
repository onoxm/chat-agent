import { windowManager } from '@main/window'
import { CHANNELS, type CommunicationType, type WindowName } from '@types'
import type { IpcMainEvent } from 'electron'

export const syncWindowState = {
  channel: CHANNELS.SEND_WINDOW_STATE,
  handle: (
    _: IpcMainEvent,
    targetWindow: WindowName,
    type: CommunicationType,
    state: any
  ) => {
    if (!windowManager.hasWindow(targetWindow)) return
    windowManager
      .getWindow(targetWindow)!
      .webContents.send(CHANNELS.ON_WINDOW_STATE, { type, data: state })
  }
}
