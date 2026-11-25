import { ItemTitle } from './ItemTitle'

interface Conversation {
  title: string
  content: string
  time: string
}

interface ConversationGroupProps {
  title: string
  conversations: Conversation[]
}

export const ConversationGroup = ({
  title,
  conversations
}: ConversationGroupProps) => {
  return (
    <div className="flex flex-col">
      <p className="mb-1.5 px-2">{title}</p>
      {conversations.map(({ title, time }) => (
        <button
          key={title}
          className="flex items-center justify-between px-2 gap-2"
        >
          <ItemTitle>{title}</ItemTitle>
          <span className="shrink-0">{time}</span>
        </button>
      ))}
    </div>
  )
}
