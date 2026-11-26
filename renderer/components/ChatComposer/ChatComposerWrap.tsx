import { ChatComposer } from './ChatComposer'
import { ChatComposerProps } from './types'

export const ChatComposerWrap = ({
  isStreaming,
  modelList,
  model,
  setModel,
  message,
  onMessageChange,
  onSend
}: ChatComposerProps) => {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 pt-2.5 pb-4.5">
      <ChatComposer
        model={model}
        setModel={setModel}
        isStreaming={isStreaming}
        message={message}
        onMessageChange={onMessageChange}
        modelList={modelList}
        onSend={onSend}
      />
      <p className="text-2.5 text-ink-400 tracking-[0.01em]">
        Enter 发送 · Shift + Enter 换行
      </p>
    </div>
  )
}
