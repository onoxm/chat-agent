import { useTruncated } from '@/hooks'
import { chainClassNames, Tooltip } from 'ono-react-element'

interface Conversation {
  id: string
  title: string
  time?: string
}

interface ConversationGroupProps {
  activeId?: string
  groupTitle: string
  conversations: Conversation[]
  onClick: (id: string) => void
}

export const ConversationGroup = ({
  onClick,
  activeId,
  groupTitle,
  conversations
}: ConversationGroupProps) => {
  const { ref, truncated } = useTruncated<HTMLSpanElement>()

  return (
    <div className="flex flex-col">
      <p className="mb-[5px] mt-3.5 px-2 text-[10.5px] font-600 tracking-[0.06em] text-ink-400">
        {groupTitle}
      </p>

      {conversations.map(({ title, time, id }) => {
        const active = activeId === id

        return (
          <Tooltip key={id} content={title} disabled={!truncated}>
            <button
              type="button"
              aria-current={active ? "page" : undefined}
              className={chainClassNames(
                "flex h-[34px] items-center justify-between gap-1.5 rounded-[8px] px-2 text-left transition-colors",
                active
                  ? "bg-brand-soft font-500 shadow-[inset_2px_0_0_var(--color-brand-solid)]"
                  : "hover:bg-surface-subtle",
              )}
              onClick={() => onClick(id)}
            >
              <span
                ref={ref}
                className={chainClassNames(
                  "flex-1 min-w-0 text-start truncate text-[12.5px]",
                  active ? "text-brand-700" : "text-ink-700",
                )}
              >
                {title}
              </span>

              {time && (
                <span
                  className={chainClassNames(
                    "shrink-0 text-[10px] tabular-nums",
                    active ? "text-brand-700" : "text-ink-400",
                  )}
                >
                  {time}
                </span>
              )}
            </button>
          </Tooltip>
        );
      })}
    </div>
  )
}
