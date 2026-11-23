import { useStore } from '@/store'
import { GearIcon } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

export const AsideBar = () => {
  const { t, i18n } = useTranslation()
  const { asideShow, asideWidth } = useStore(['asideShow', 'asideWidth'])

  return (
    <aside
      className={[
        'h-full border-r border-gray-300 transition-all duration-300 overflow-hidden',
        asideShow ? 'p-2' : 'py-2'
      ].join(' ')}
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

      <button
        className="p-2 flex items-center gap-2 cursor-pointer rounded-sm hover:bg-gray-100"
        onClick={() => window.api.createWindow('settings')}
        style={{ width: asideWidth - 16 }}
      >
        <GearIcon size={24} />
        {t('settings')}
      </button>
    </aside>
  )
}
