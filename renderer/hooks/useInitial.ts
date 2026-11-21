import { useStore } from '@/store'
import { CHANNELS, WindowAction } from '@types'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useInitial = () => {
  const { i18n } = useTranslation()
  const { language, alwaysOnTop } = useStore(['language', 'alwaysOnTop'])

  useEffect(() => {
    window.api.onState(CHANNELS.ON_WINDOW_STATE, ({ type, data }) => {
      useStore.setState({ [type]: data })
    })
  }, [])

  useEffect(() => {
    if (language) i18n.changeLanguage(language)
  }, [language])

  useEffect(() => {
    if (alwaysOnTop !== undefined)
      window.api.windowAction(WindowAction.AlwaysOnTop, alwaysOnTop)
  }, [alwaysOnTop])
}
