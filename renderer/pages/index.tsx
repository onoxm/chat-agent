import { AsideBar, HeadBar } from '@/components'
import { Message, Model, modelList } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default () => {
  const { t } = useTranslation()

  const [value, setValue] = useState('')
  const [model, setModel] = useState<Model>('deepseek-r1')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!value || isStreaming) return

    const currentMessages: Message[] = [
      ...messages,
      { role: 'user', content: value }
    ]
    setValue('')
    // 先追加一条空的 assistant 消息，流式分片都往这条里拼
    setMessages([...currentMessages, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    window.api.chatWithAgent(
      {
        model,
        messages: currentMessages
      },
      content => {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          next[next.length - 1] = {
            ...last,
            content: last.content + content
          }
          return next
        })
      },
      () => setIsStreaming(false),
      message => {
        setMessages(prev => {
          const next = [...prev]
          const last = next[next.length - 1]
          next[next.length - 1] = {
            ...last,
            content: `${last.content}\n请求失败：${message}`
          }
          return next
        })
        setIsStreaming(false)
      }
    )
  }

  useEffect(() => {
    if (!messagesRef.current) return
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages])

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <HeadBar />

      <div className="flex flex-1 overflow-hidden">
        <AsideBar />

        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 overflow-hidden">
          <div
            ref={messagesRef}
            className="w-full flex-1 flex flex-col gap-2 border border-gray-300 rounded-lg p-4 overflow-x-hidden overflow-y-auto scroll-smooth"
          >
            {messages.map(({ role, content }, i) => (
              <p key={i}>
                <strong>{role}:</strong> {content}
              </p>
            ))}
          </div>

          <div className="w-full flex">
            <textarea
              className="flex-1 min-h-[1lh] max-h-[10lh] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent field-sizing-content resize-none"
              placeholder={t('placeholder')}
              value={value.trim()}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSendMessage()
              }}
            />

            <select
              className="ml-4 cursor-pointer px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-gray-300"
              disabled={isStreaming}
              value={model}
              onChange={e => setModel(e.target.value as Model)}
            >
              {modelList.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              className="cursor-pointer ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSendMessage}
              disabled={isStreaming}
            >
              {isStreaming ? t('generating') : t('send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
