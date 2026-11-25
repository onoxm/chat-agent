import { useStore } from '@/store'
import {
  CardsIcon,
  MinusIcon,
  PushPinSimpleIcon,
  PushPinSimpleSlashIcon,
  SquareIcon,
  XIcon
} from '@phosphor-icons/react'
import { WindowAction } from '@types'
import { chainClassNames } from 'ono-react-element'
import { useMemo } from 'react'
import { useLocation } from 'react-router'
import { JSX } from 'react/jsx-dev-runtime'
import logo from '../../public/logo.png'

interface HeaderIconInfo {
  Icon: ({ size }: { size: number }) => JSX.Element
  action: WindowAction
}

export const HeadBar = () => {
  const location = useLocation()
  const { alwaysOnTop, maximized } = useStore(['alwaysOnTop', 'maximized'])

  const windowAction = window.api.windowAction

  const windowBtnList = useMemo<HeaderIconInfo[]>(() => {
    const alwaysOnTopArr =
      location.pathname === '/settings'
        ? []
        : [
            {
              action: WindowAction.AlwaysOnTop,
              Icon: ({ size }) =>
                alwaysOnTop ? (
                  <PushPinSimpleIcon size={size} />
                ) : (
                  <PushPinSimpleSlashIcon size={size} />
                )
            } as HeaderIconInfo
          ]

    return [
      ...alwaysOnTopArr,
      {
        action: WindowAction.Minimize,
        Icon: ({ size }) => <MinusIcon size={size} />
      },
      {
        action: WindowAction.Maximize,
        Icon: ({ size }) =>
          maximized ? <CardsIcon size={size} /> : <SquareIcon size={size} />
      },
      {
        action: WindowAction.Close,
        Icon: ({ size }) => <XIcon size={size} />
      }
    ]
  }, [alwaysOnTop, maximized, location.pathname])

  return (
    <div className="w-full shrink-0 flex items-center justify-between gap-4 drag p-2 border-b border-line-200">
      <img src={logo} className="size-6" />

      <div className="flex flex-1 gap-4 justify-end">
        {windowBtnList.map(({ action, Icon }) => (
          <button
            key={action}
            className={chainClassNames(
              'p-1.75 rounded-[7px] text-ink-400 cursor-pointer no-drag',
              action === WindowAction.Close
                ? 'hover:bg-danger-600 hover:text-on-brand'
                : 'hover:bg-surface-subtle hover:text-ink-700',
              action === WindowAction.AlwaysOnTop && alwaysOnTop
                ? 'text-ink-700'
                : ''
            )}
            onClick={() => {
              if (action === WindowAction.AlwaysOnTop)
                useStore.setState({ alwaysOnTop: !alwaysOnTop })
              else windowAction(action)
            }}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}
