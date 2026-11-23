/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
import {
  type AgentOptions,
  CHANNELS,
  type CommunicationPayload,
  type CommunicationType,
  WindowAction,
  type WindowName
} from '@types'

export interface IElectronAPI {
  windowAction: (action: WindowAction, state?: boolean) => void
  createWindow: (windowName: WindowName) => void

  sendState: (
    targetWindow: WindowName | 'all',
    type: CommunicationType,
    state: any
  ) => void
  onState: (
    channel: (typeof CHANNELS)[keyof typeof CHANNELS],
    callback: (payload: CommunicationPayload) => void
  ) => void

  encryptStr: (str: string) => Promise<string>
  decryptStr: (str: string) => Promise<string>

  importConfig: () => Promise<Record<string, unknown> | null>
  exportConfig: (path: string, config: any, filename: string) => Promise<string>

  chatWithAgent: (
    options: AgentOptions,
    onChunk: (content: string) => void,
    onDone?: () => void,
    onError?: (message: string) => void
  ) => void
}

declare global {
  interface Window {
    api: IElectronAPI
  }
}
