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

interface IpcAction {
  global: IpcMainAction
  main: IpcMainAction
  settings: IpcMainAction
}

export const ipcAction: IpcAction = {
  global: {
    on: [windowBasicAction, createWindow, syncWindowState],
    handle: [decryptStr, getCurrentWindowState]
  },
  main: {
    on: [chatWithAgent],
    handle: []
  },
  settings: {
    on: [],
    handle: [encryptStr, exportConfig, importConfig]
  }
}
