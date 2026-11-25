import { ChatComposer } from '@/components'
import { useStore } from '@/store'
import { Message, ModelInfo } from '@types'
import { useEffect, useRef, useState } from 'react'

const ollamaModelList = [
  { label: 'deepseek-r1', url: '', apiKey: '' },
  { label: 'llama3', url: '', apiKey: '' },
  { label: 'qwen3.8', url: '', apiKey: '' }
]

export default () => {
  const { defaultModel, modelList, encryptionPassphrase } = useStore([
    'defaultModel',
    'modelList',
    'encryptionPassphrase'
  ])

  const [model, setModel] = useState<ModelInfo>(
    defaultModel.label ? defaultModel : (modelList[0] ?? ollamaModelList[0])
  )
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [decryptedApiKey, setDecryptedApiKey] = useState('')

  const messagesRef = useRef<HTMLDivElement>(null)
  // 每次新建对话递增，流式回调据此丢弃上一轮对话的残留分片
  const conversationRef = useRef(0)

  const handleSendMessage = async () => {
    if (!value || isStreaming) return

    const conversationId = conversationRef.current
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
        model: model.label,
        url: model.url,
        apiKey: decryptedApiKey,
        messages: currentMessages
      },
      content => {
        if (conversationRef.current !== conversationId) return

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
      () => {
        if (conversationRef.current !== conversationId) return

        setIsStreaming(false)
      },
      message => {
        if (conversationRef.current !== conversationId) return

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

  useEffect(() => {
    let cancelled = false

    const decrypt = async () => {
      if (!model.apiKey || !encryptionPassphrase) {
        setDecryptedApiKey('')
        return
      }

      const apiKey = await window.api.decryptStr(
        encryptionPassphrase,
        model.apiKey
      )

      if (!cancelled) setDecryptedApiKey(apiKey)
    }

    decrypt()

    return () => {
      cancelled = true
    }
  }, [model.apiKey, encryptionPassphrase])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 overflow-hidden">
      <div
        ref={messagesRef}
        className="w-full flex-1 flex flex-col gap-2 border border-gray-300 rounded-lg p-4 overflow-x-hidden overflow-y-auto scroll-smooth"
      >
        {messages.map(({ role, content }, i) => {
          const isThinking =
            role === 'assistant' && content === '' && isStreaming

          return (
            <p className="select-text" key={i}>
              <strong>{role}:</strong>{' '}
              {isThinking ? (
                <span className="text-ink-400 animate-pulse">思考中…</span>
              ) : (
                content
              )}
            </p>
          )
        })}
      </div>

      <ChatComposer
        model={model}
        setModel={setModel}
        isStreaming={isStreaming}
        message={value}
        onMessageChange={setValue}
        modelList={[...ollamaModelList, ...modelList]}
        onSend={handleSendMessage}
      />
    </div>
  )
}
