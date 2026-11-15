import { useStore } from '@/store'
import { WindowAction } from '@types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useInitial = () => {
  const { i18n } = useTranslation()
  const { language, alwaysOnTop } = useStore(['language', 'alwaysOnTop'])

  useEffect(() => {
    if (language) i18n.changeLanguage(language)
  }, [language])

  useEffect(() => {
    if (alwaysOnTop !== undefined)
      window.electronAPI.windowAction(WindowAction.AlwaysOnTop)
  }, [])
}
