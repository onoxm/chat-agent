import { ArrowUpIcon } from '@phosphor-icons/react'
import { chainClassNames } from 'ono-react-element'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ModelSelect } from '../ModelSelect'
import { ChatComposerProps } from './types'

export const ChatComposer = ({
  isStreaming,
  modelList,
  model,
  setModel,
  message,
  onMessageChange,
  onSend
}: ChatComposerProps) => {
  const { t } = useTranslation()

  const [focus, setFocus] = useState(false)

  return (
    <div
      className={chainClassNames(
        'w-180 rounded-[15px] border bg-surface-base p-3 pb-2.25',
        focus
          ? 'border-brand-solid/65 shadow-composer-focus'
          : 'border-line-300 shadow-composer'
      )}
    >
      <textarea
        className="w-full min-h-[26px] max-h-[132px] px-1 pt-[3px] pb-[7px] text-[13.5px] leading-[1.65] text-ink-900 placeholder:text-ink-400 bg-transparent outline-none field-sizing-content resize-none"
        placeholder={t('chatPage.placeholder')}
        value={message}
        onChange={e => onMessageChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            onSend()
          }
        }}
      />

      <div className="flex justify-between items-center">
        <ModelSelect
          model={model}
          modelList={modelList}
          disabled={isStreaming}
          onChange={setModel}
        />

        <div className="flex items-center gap-2.25">
          <p className="text-2.625 text-ink-400">Enter 发送</p>

          <button
            className="cursor-pointer p-2 bg-brand-solid text-white rounded-lg hover:bg-brand-solid-hover shadow-sendButton disabled:opacity-60 disabled:cursor-not-allowed active:transform-scale-96 transition-bg transition-transform duration-160"
            onClick={onSend}
            disabled={isStreaming || !message}
          >
            <ArrowUpIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
