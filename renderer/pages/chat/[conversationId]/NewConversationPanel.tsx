import {
  BookOpenIcon,
  CodeIcon,
  ListBulletsIcon,
  PencilSimpleIcon
} from '@phosphor-icons/react'
import { SuggestionButton } from './SuggestionButton'

const suggestions = [
  {
    icon: CodeIcon,
    title: '审查一段代码',
    desc: '找出潜在的 bug 与性能问题',
    prompt: '帮我审查这段代码，找出潜在的 bug 和性能问题：'
  },
  {
    icon: BookOpenIcon,
    title: '解释一个概念',
    desc: '用类比讲清复杂的技术原理',
    prompt: '用通俗的类比，帮我讲清楚这个概念：'
  },
  {
    icon: PencilSimpleIcon,
    title: '起草一段文案',
    desc: '邮件、公告、产品说明都可以',
    prompt: '帮我起草一段产品更新公告，语气专业但友好：'
  },
  {
    icon: ListBulletsIcon,
    title: '整理零散笔记',
    desc: '把想法变成结构清晰的大纲',
    prompt: '把这些零散的想法整理成一份结构清晰的大纲：'
  }
]

interface NewConversationPanelProps {
  /** 点击建议卡片时把预设提问回填到输入框 */
  onPickPrompt?: (prompt: string) => void
}

export const NewConversationPanel = ({
  onPickPrompt
}: NewConversationPanelProps) => {
  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-5">
      <div className="w-full max-w-[640px] text-center">
        <h1 className="mt-[22px] text-[26px] font-600 leading-[1.3] tracking-[-0.02em] text-ink-900">
          今天想聊点什么？
        </h1>

        <div className="mx-auto mt-[26px] grid max-w-[600px] grid-cols-2 gap-2.5 text-left">
          {suggestions.map(({ icon: Icon, title, desc, prompt }) => (
            <SuggestionButton
              key={title}
              title={title}
              desc={desc}
              prompt={prompt}
              Icon={Icon}
              onPickPrompt={prompt => onPickPrompt?.(prompt)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
