import { defineGlobalState, persistMiddleware } from '@onoxm/react-tools'
import type { ModelInfo } from '@types'
import type { ThemeMode } from 'ono-react-element'

const initialState = {
  theme: 'light' as ThemeMode,
  language: 'zh',
  asideShow: true,
  asideWidth: 240,
  asideWidthScope: [200, 320],
  alwaysOnTop: false,
  maximized: false,
  encryptionPassphrase: 'abcd123456',
  defaultModel: {} as ModelInfo,
  modelList: [] as ModelInfo[]
}

export type InitialStateType = typeof initialState

export const useStore = defineGlobalState(initialState, [
  persistMiddleware({
    name: 'chat-agent-store',
    properties: [
      'theme',
      'language',
      'asideShow',
      'asideWidth',
      'asideWidthScope',
      'alwaysOnTop',
      'defaultModel',
      'modelList',
      'encryptionPassphrase'
    ]
  })
])
