import { defineGlobalState, persistMiddleware } from '@onoxm/react-tools'
import type { ModelInfo } from '@types'

const initialState = {
  language: 'zh',
  asideShow: true,
  asideWidth: 240,
  asideWidthScope: [200, 300],
  alwaysOnTop: false,
  defaultModel: '',
  modelList: [] as ModelInfo[]
}

export type InitialStateType = typeof initialState

export const useStore = defineGlobalState(initialState, [
  persistMiddleware({
    name: 'chat-agent-store',
    properties: [
      'language',
      'asideShow',
      'asideWidth',
      'asideWidthScope',
      'alwaysOnTop',
      'defaultModel',
      'modelList'
    ]
  })
])
