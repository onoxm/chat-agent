import { useStore } from '@/store'
import { useTranslation } from 'react-i18next'

export const CommonPage = () => {
  const { i18n } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-full cursor-pointer"
        onClick={() => {
          const nextLanguage = i18n.language === 'en' ? 'zh' : 'en'
          i18n.changeLanguage(nextLanguage)
          useStore.setState({ language: nextLanguage })
          window.api.sendState('all', 'language', nextLanguage)
        }}
      >
        {i18n.language === 'en' ? 'en' : '中文'}
      </button>
    </div>
  )
}
