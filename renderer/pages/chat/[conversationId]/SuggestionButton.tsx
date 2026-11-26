import { ArrowUpRightIcon, type Icon } from '@phosphor-icons/react'

interface SuggestionButtonProps {
  title: string
  desc: string
  prompt: string
  Icon: Icon
  onPickPrompt: (prompt: string) => void
}

export const SuggestionButton = ({
  title,
  desc,
  prompt,
  Icon,
  onPickPrompt
}: SuggestionButtonProps) => {
  return (
    <button
      key={title}
      type="button"
      onClick={() => onPickPrompt?.(prompt)}
      className="group relative flex items-start gap-[11px] rounded-[12px] border border-line-200 bg-surface-base px-[14px] py-[13px] transition-[border-color,box-shadow,transform] duration-180 hover:-translate-y-px hover:border-brand-solid/45 hover:shadow-[0_10px_24px_-16px_rgba(23,26,33,0.4)]"
    >
      <span className="grid size-8 flex-none place-items-center rounded-[9px] bg-brand-soft text-brand-solid">
        <Icon size={16} />
      </span>

      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[12.5px] font-600 text-ink-900">{title}</span>
        <span className="text-[11px] leading-[1.6] text-ink-400">{desc}</span>
      </span>

      <ArrowUpRightIcon
        size={13}
        className="absolute right-[11px] top-3 translate-x-[-3px] translate-y-[3px] text-ink-400 opacity-0 transition-[opacity,transform] duration-180 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
      />
    </button>
  )
}
