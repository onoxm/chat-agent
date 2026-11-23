// preload.js
import {
  CHANNELS,
  CommunicationPayload,
  CommunicationType,
  WindowAction,
  type AgentOptions,
  type ChatStreamPayload,
  type WindowName
} from '@types'
import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'

const apiKey = 'api'

const api = {
  windowAction: (action: WindowAction, state?: boolean) =>
    ipcRenderer.send(CHANNELS.WINDOW_ACTION, action, state),
  createWindow: (windowName: WindowName) =>
    ipcRenderer.send(CHANNELS.CREATE_WINDOW, windowName),

  sendState: (
    targetWindow: WindowName | 'all',
    type: CommunicationType,
    state: any
  ) => ipcRenderer.send(CHANNELS.SEND_WINDOW_STATE, targetWindow, type, state),
  onState: (
    channel: (typeof CHANNELS)[keyof typeof CHANNELS],
    callback: (payload: CommunicationPayload) => void
  ) => ipcRenderer.on(channel, (_, payload) => callback(payload)),

  encryptStr: (str: string) => ipcRenderer.invoke(CHANNELS.ENCRYPT_STR, str),
  decryptStr: (str: string) => ipcRenderer.invoke(CHANNELS.DECRYPT_STR, str),

  importConfig: () => ipcRenderer.invoke(CHANNELS.IMPORT_CONFIG),
  exportConfig: (path: string, config: any, filename: string) =>
    ipcRenderer.invoke(CHANNELS.EXPORT_CONFIG, path, config, filename),

  chatWithAgent: (
    options: AgentOptions,
    onChunk: (content: string) => void,
    onDone?: () => void,
    onError?: (message: string) => void
  ) => {
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`

    const listener = (_event: IpcRendererEvent, payload: ChatStreamPayload) => {
      if (payload.requestId !== requestId) return

      if (payload.type === 'chunk') {
        onChunk(payload.content)
        return
      }

      ipcRenderer.removeListener(CHANNELS.CHAT_WITH_AGENT_STREAM, listener)

      if (payload.type === 'done') onDone?.()
      else onError?.(payload.message)
    }

    ipcRenderer.on(CHANNELS.CHAT_WITH_AGENT_STREAM, listener)
    ipcRenderer.send(CHANNELS.CHAT_WITH_AGENT, { ...options, requestId })
  }
} satisfies Window[typeof apiKey]

// 使用 contextBridge 安全地暴露有限、具体的 API
contextBridge.exposeInMainWorld(apiKey, api)
