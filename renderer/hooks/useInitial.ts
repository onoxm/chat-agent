import { event } from '@/event'
import { useStore } from '@/store'
import { CHANNELS, WindowAction } from '@types'
import { useTheme } from 'ono-react-element'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useInitial = () => {
  const { i18n } = useTranslation()
  const { theme, language, alwaysOnTop } = useStore([
    'theme',
    'language',
    'alwaysOnTop'
  ])

  const { cycleTheme } = useTheme({
    theme,
    onDark: () => document.body.classList.add('dark'),
    onLight: () => document.body.classList.remove('dark')
  })

  useEffect(() => {
    window.api.onState(CHANNELS.ON_WINDOW_STATE, ({ type, data }) => {
      useStore.setState({ [type]: data })
    })
  }, [])

  useEffect(() => {
    event.clear('change-theme')
    event.on('change-theme', cb => cb(cycleTheme()))
  }, [theme])

  useEffect(() => {
    if (language) i18n.changeLanguage(language)
  }, [language])

  useEffect(() => {
    if (alwaysOnTop !== undefined)
      window.api.windowAction(WindowAction.AlwaysOnTop, alwaysOnTop)
  }, [alwaysOnTop])
}
