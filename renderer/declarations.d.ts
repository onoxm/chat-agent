/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
import {
  type AgentOptions,
  CHANNELS,
  WindowAction,
  type WindowName,
  type CommunicationType,
  type CommunicationPayload
} from '@types'

export interface IElectronAPI {
  windowAction: (action: WindowAction, state?: boolean) => void
  createWindow: (windowName: WindowName) => void

  sendState: (
    targetWindow: WindowName,
    type: CommunicationType,
    state: string
  ) => void
  onState: (
    channel: (typeof CHANNELS)[keyof typeof CHANNELS],
    callback: (payload: CommunicationPayload) => void
  ) => void

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
