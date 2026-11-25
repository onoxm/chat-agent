import { useStore } from '@/store'
import { chainClassNames, ResizeDivider } from 'ono-react-element'
import { useState } from 'react'

interface AsidePanelProps {
  className?: string
  children: (resizing: boolean) => React.ReactNode
}

export const AsidePanel = ({ className, children }: AsidePanelProps) => {
  const { asideShow, asideWidth, asideWidthScope } = useStore([
    'asideShow',
    'asideWidth',
    'asideWidthScope'
  ])
  // 拖动过程中关闭宽度过渡，只有切换 asideShow 时才播放动画
  const [resizing, setResizing] = useState(false)

  return (
    <aside
      className={chainClassNames(
        'h-full border-r border-line-200 transition-[width] duration-300 overflow-hidden relative',
        className
      )}
      style={{
        width: asideShow ? asideWidth : 0,
        transitionProperty: resizing ? 'none' : undefined
      }}
    >
      {children(resizing)}

      {asideShow && (
        <div className="absolute right-0 top-0 h-full w-1">
          <ResizeDivider
            closeFit="left"
            defaultSize={asideWidth}
            minSize={asideWidthScope[0]}
            maxSize={asideWidthScope[1]}
            color={{ active: 'var(--color-brand-solid' }}
            onResize={width => useStore.setState({ asideWidth: width })}
            onCloseLessMinSize={size => {
              if (asideWidthScope[0] - size < 40) return
              setResizing(false)
              useStore.setState({ asideShow: false })
            }}
            onResizeStart={() => setResizing(true)}
            onResizeEnd={() => setResizing(false)}
          />
        </div>
      )}
    </aside>
  )
}
