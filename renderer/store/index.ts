import { defineGlobalState, persistMiddleware } from '@onoxm/react-tools'

const initialState = {
  language: 'zh',
  asideShow: true,
  asideWidth: 240,
  asideWidthScope: [200, 300],
  alwaysOnTop: false
}

export const useStore = defineGlobalState(initialState, [
  persistMiddleware({
    name: 'chat-agent-store',
    properties: [
      'language',
      'asideShow',
      'asideWidth',
      'asideWidthScope',
      'alwaysOnTop'
    ]
  })
])
