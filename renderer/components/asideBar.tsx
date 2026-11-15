import { useStore } from '@/store'
import { useTranslation } from 'react-i18next'

export const AsideBar = () => {
  const { i18n } = useTranslation()
  const { asideShow, asideWidth } = useStore(['asideShow', 'asideWidth'])

  return (
    <aside
      className="h-full border-r border-gray-300 transition-w duration-300 overflow-hidden"
      style={{ width: asideShow ? asideWidth : 0 }}
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
    </aside>
  )
}
