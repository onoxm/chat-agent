import { WindowName } from '@types'
import { lazy } from 'react'
import { useInitial } from './hooks'

const hash = window.location.hash.slice(1) as WindowName

const Main = lazy(() => import('./pages/index'))

const Settings = lazy(() => import('./pages/settings'))

export default () => {
  useInitial()

  return hash === 'settings' ? <Settings /> : <Main />
}
