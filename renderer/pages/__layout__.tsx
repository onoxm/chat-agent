import { HeadBar, NavBar } from '@/components'
import { useInitial } from '@/hooks'
import { chainClassNames } from 'ono-react-element'
import { Outlet, useLocation } from 'react-router'

export default () => {
  const location = useLocation()
  useInitial()

  return (
    <div
      className={chainClassNames(
        'w-screen h-screen flex flex-col overflow-hidden bg-surface-rail'
      )}
    >
      <HeadBar />

      {location.pathname !== '/settings' ? (
        <div className="flex flex-1 overflow-hidden">
          <NavBar />

          <Outlet />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
