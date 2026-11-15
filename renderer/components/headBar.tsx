import { useStore } from '@/store'
import {
  ArrowsInSimpleIcon,
  FrameCornersIcon,
  PushPinSimpleIcon,
  PushPinSimpleSlashIcon,
  SidebarSimpleIcon,
  XIcon
} from '@phosphor-icons/react'
import { WindowAction } from '@types'

const titleBarIconSize = 24

export const HeadBar = () => {
  const alwaysOnTop = useStore('alwaysOnTop')

  const windowAction = window.electronAPI.windowAction

  const windowBtnList = [
    {
      action: WindowAction.AlwaysOnTop,
      icon: alwaysOnTop ? (
        <PushPinSimpleIcon size={titleBarIconSize} />
      ) : (
        <PushPinSimpleSlashIcon size={titleBarIconSize} />
      ),
      onClick: () => useStore.setState({ alwaysOnTop: !alwaysOnTop })
    },
    {
      action: WindowAction.Minimize,
      icon: <ArrowsInSimpleIcon size={titleBarIconSize} color="green" />
    },
    {
      action: WindowAction.Maximize,
      icon: <FrameCornersIcon size={titleBarIconSize} color="orange" />
    },
    {
      action: WindowAction.Close,
      icon: <XIcon size={titleBarIconSize} color="red" />
    }
  ]

  return (
    <div className="w-full h-10 shrink-0 flex items-center justify-between gap-4 drag p-2 border-b border-gray-300">
      <button
        className="cursor-pointer no-drag"
        onClick={() => {
          useStore.setState(({ asideShow }) => ({
            asideShow: !asideShow
          }))
        }}
      >
        <SidebarSimpleIcon size={titleBarIconSize} />
      </button>

      <div className="flex gap-4">
        {windowBtnList.map(({ action, icon, onClick }) => (
          <button
            key={action}
            className="cursor-pointer no-drag"
            onClick={() => {
              windowAction(action)
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
