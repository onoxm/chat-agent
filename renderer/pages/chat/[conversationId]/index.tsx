import { ChatComposerWrap } from '@/components'
import { useStore } from '@/store'
import { Message, ModelInfo } from '@types'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { NewConversationPanel } from './NewConversationPanel'

export default () => {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { defaultModel, modelList, encryptionPassphrase } = useStore([
    'defaultModel',
    'modelList',
    'encryptionPassphrase'
  ])

  const [model, setModel] = useState<ModelInfo>(
    defaultModel.label ? defaultModel : modelList[0]
  )
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [decryptedApiKey, setDecryptedApiKey] = useState('')

  const messagesRef = useRef<HTMLDivElement>(null)
  // 保存最新路由 id：从 "new" 跳转到真实 id 时，回调里捕获的 conversationId 仍是旧值
  const conversationIdRef = useRef(conversationId)
  conversationIdRef.current = conversationId

  const handleSendMessage = async () => {
    if (!value || isStreaming || !conversationId) return

    const currentConversationId =
      conversationId === 'new' ? crypto.randomUUID() : conversationId

    if (conversationId === 'new') navigate(`/chat/${currentConversationId}`)

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
        if (currentConversationId !== conversationIdRef.current) return

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
        if (currentConversationId !== conversationIdRef.current) return

        setIsStreaming(false)
      },
      message => {
        if (currentConversationId !== conversationIdRef.current) return

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
    <>
      {conversationId === 'new' ? (
        <NewConversationPanel onPickPrompt={setValue} />
      ) : (
        <div
          ref={messagesRef}
          className="w-full flex-1 flex flex-col gap-2 p-4 overflow-x-hidden overflow-y-auto scroll-smooth"
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
      )}

      <ChatComposerWrap
        model={model}
        setModel={setModel}
        isStreaming={isStreaming}
        message={value}
        onMessageChange={setValue}
        modelList={modelList}
        onSend={handleSendMessage}
      />
    </>
  )
}
