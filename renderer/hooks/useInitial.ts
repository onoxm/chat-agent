import { event } from '@/event'
import { useStore } from '@/store'
import { CHANNELS, WindowAction } from '@types'
import { useTheme } from 'ono-react-element'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

export const useInitial = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { i18n } = useTranslation()
  const { theme, language, alwaysOnTop } = useStore([
    'theme',
    'language',
    'alwaysOnTop'
  ])

  const redirectWindow = () => {
    const windowName = (new URLSearchParams(location.search).get('window') ??
      'main') as string
    if (windowName === 'main') return navigate('/chat/new')
    navigate(`/${windowName}`)
  }

  const { cycleTheme } = useTheme({
    theme,
    onDark: () => document.documentElement.classList.add('dark'),
    onLight: () => document.documentElement.classList.remove('dark')
  })

  useEffect(() => {
    window.api.onState(CHANNELS.ON_WINDOW_STATE, ({ type, data }) =>
      useStore.setState({ [type]: data })
    )

    redirectWindow()
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

  // 首次加载时同步窗口当前是否最大化
  useEffect(() => {
    window.api.getCurrentWindowState('maximized').then(value => {
      useStore.setState({ maximized: Boolean(value) })
    })
  }, [])
}
