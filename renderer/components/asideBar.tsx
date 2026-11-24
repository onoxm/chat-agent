import { useStore } from '@/store'
import { useTranslation } from 'react-i18next'
import { NavBar } from './navBar'

const NAV_BAR_WIDTH = 40

export const AsideBar = () => {
  const { i18n } = useTranslation()
  const { asideShow, asideWidth } = useStore(['asideShow', 'asideWidth'])

  const toggleChatBar = () => {
    useStore.setState({
      asideShow: !asideShow
    })
  }

  return (
    <aside
      className="h-full border-r border-gray-300 transition-w duration-300 overflow-hidden relative"
      style={{
        width: asideShow ? asideWidth : NAV_BAR_WIDTH
      }}
    >
      <NavBar toggleChatBar={toggleChatBar} navBarWidth={NAV_BAR_WIDTH} />

      <div
        className="h-full p-2 absolute left-0 top-0 transition-transform duration-300"
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
    </aside>
  )
}
