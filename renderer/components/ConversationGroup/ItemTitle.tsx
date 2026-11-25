import { useTruncated } from '@/hooks'
import { Tooltip } from 'ono-react-element'

export const ItemTitle = ({ children }: { children: string }) => {
  const { ref, truncated } = useTruncated<HTMLSpanElement>()

  return (
    <Tooltip content={children} disabled={!truncated}>
      <span ref={ref} className="flex-1 min-w-0 text-start truncate">
        {children}
      </span>
    </Tooltip>
  )
}
