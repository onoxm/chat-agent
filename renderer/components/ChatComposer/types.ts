import { ModelInfo } from '@types'

export interface ChatComposerProps {
  model: ModelInfo
  isStreaming: boolean
  modelList: ModelInfo[]
  setModel: (model: ModelInfo) => void
  message: string
  onMessageChange: (value: string) => void
  onSend: () => void
}
