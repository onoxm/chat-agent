import { useStore } from '@/store'
import { TITLE_BAR_ICON_SIZE } from '@common'
import {
  ArrowsInSimpleIcon,
  ArrowsOutSimpleIcon,
  MinusIcon,
  PushPinSimpleIcon,
  PushPinSimpleSlashIcon,
  XIcon
} from '@phosphor-icons/react'
import { WindowAction } from '@types'
import { useMemo, useState } from 'react'
import { JSX } from 'react/jsx-dev-runtime'
import logo from '../../public/logo.png'

const hash = window.location.hash.slice(1) as string

export const HeadBar = () => {
  const alwaysOnTop = useStore('alwaysOnTop')

  const [isFullScreen, setFullScreen] = useState(false)

  const windowAction = window.api.windowAction

  const windowBtnList = useMemo<
    { icon: JSX.Element; action: WindowAction; onClick?: () => void }[]
  >(() => {
    const alwaysOnTopArr =
      hash === 'settings'
        ? []
        : [
            {
              action: WindowAction.AlwaysOnTop,
              icon: alwaysOnTop ? (
                <PushPinSimpleIcon size={TITLE_BAR_ICON_SIZE} />
              ) : (
                <PushPinSimpleSlashIcon size={TITLE_BAR_ICON_SIZE} />
              )
            }
          ]

    return [
      ...alwaysOnTopArr,
      {
        action: WindowAction.Minimize,
        icon: <MinusIcon size={TITLE_BAR_ICON_SIZE} color="green" />
      },
      {
        action: WindowAction.Maximize,
        icon: isFullScreen ? (
          <ArrowsInSimpleIcon size={TITLE_BAR_ICON_SIZE} color="orange" />
        ) : (
          <ArrowsOutSimpleIcon size={TITLE_BAR_ICON_SIZE} color="orange" />
        ),
        onClick: async () => {
          const bl = (await window.api.getCurrentWindowState(
            'maximize'
          )) as boolean
          setFullScreen(bl)
        }
      },
      {
        action: WindowAction.Close,
        icon: <XIcon size={TITLE_BAR_ICON_SIZE} color="red" />
      }
    ]
  }, [alwaysOnTop, isFullScreen])

  return (
    <div className="w-full shrink-0 flex items-center justify-between gap-4 drag p-2 border-b border-gray-300">
      <img src={logo} className="size-6" />

      <div className="flex flex-1 gap-4 justify-end">
        {windowBtnList.map(({ action, icon, onClick }) => (
          <button
            key={action}
            className="cursor-pointer no-drag"
            onClick={() => {
              if (action === WindowAction.AlwaysOnTop)
                useStore.setState({ alwaysOnTop: !alwaysOnTop })
              else windowAction(action)
              onClick?.()
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  )
}
