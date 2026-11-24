import { type IpcMainEvent, type IpcMainInvokeEvent } from 'electron'
import { chatWithAgent } from '../agnet'
import { exportConfig, importConfig } from './configAction'
import { createWindow } from './createWindow'
import { decryptStr, encryptStr } from './stringHandler'
import { getCurrentWindowState, syncWindowState } from './syncWindowState'
import { windowBasicAction } from './windowBasicAction'

interface IpcMainAction {
  on: {
    channel: string
    handle: (event: IpcMainEvent, ...args: any[]) => void
  }[]
  handle: {
    channel: string
    handle: (event: IpcMainInvokeEvent, ...args: any[]) => void
  }[]
}

export const ipcMainAction: IpcMainAction = {
  on: [chatWithAgent, windowBasicAction, createWindow, syncWindowState],
  handle: [
    encryptStr,
    decryptStr,
    exportConfig,
    importConfig,
    getCurrentWindowState
  ]
}
