import { useStore } from '@/store'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavBar } from './navBar'
import { ResizeDivider } from './ResizeDivider'

const NAV_BAR_WIDTH = 40

export const AsideBar = () => {
  const { i18n } = useTranslation()
  const { asideShow, asideWidth, asideWidthScope } = useStore([
    'asideShow',
    'asideWidth',
    'asideWidthScope'
  ])
  // 拖动过程中关闭宽度过渡，只有切换 asideShow 时才播放动画
  const [resizing, setResizing] = useState(false)

  const toggleChatBar = () => {
    useStore.setState({
      asideShow: !asideShow
    })
  }

  return (
    <aside
      className="h-full border-r border-gray-300 transition-[width] duration-300 overflow-hidden relative"
      style={{
        width: asideShow ? asideWidth : NAV_BAR_WIDTH,
        transitionProperty: resizing ? 'none' : undefined
      }}
    >
      <NavBar toggleChatBar={toggleChatBar} navBarWidth={NAV_BAR_WIDTH} />

      <div
        className={`h-full p-2 absolute left-0 top-0 ${
          resizing ? '' : 'transition-transform duration-300'
        }`}
        style={{
          width: asideWidth - NAV_BAR_WIDTH,
          transform: `translateX(${asideShow ? NAV_BAR_WIDTH : -(asideWidth - NAV_BAR_WIDTH)}px)`
        }}
      >
        <button
          className="w-full cursor-pointer"
          onClick={() => {
            const nextLanguage = i18n.language === 'en' ? 'zh' : 'en'
            i18n.changeLanguage(nextLanguage)
            useStore.setState({ language: nextLanguage })
          }}
        >
          {i18n.language === 'en' ? 'en' : '中文'}
        </button>
      </div>

      {asideShow && (
        <div className="absolute right-0 top-0 h-full w-1">
          <ResizeDivider
            closeFit="left"
            defaultSize={asideWidth}
            minSize={asideWidthScope[0]}
            maxSize={asideWidthScope[1]}
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
