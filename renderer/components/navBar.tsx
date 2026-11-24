import { event } from '@/event'
import { useStore } from '@/store'
import { TITLE_BAR_ICON_SIZE } from '@common'
import {
  ChatTextIcon,
  DesktopIcon,
  GearIcon,
  MoonIcon,
  SunIcon
} from '@phosphor-icons/react'
import type { ThemeMode } from 'ono-react-element'

interface ActionItem {
  title: string
  Icon: React.FC<{ size: number }>
  onClick: () => void
}

interface NavBarProps {
  navBarWidth: number
  toggleChatBar: () => void
}

export const NavBar = ({ toggleChatBar, navBarWidth }: NavBarProps) => {
  const theme = useStore('theme')

  const navList: ActionItem[][] = [
    [
      {
        title: '聊天',
        Icon: ({ size }) => <ChatTextIcon size={size} />,
        onClick: toggleChatBar
      }
    ],
    [
      {
        title: '主题切换',
        Icon: ({ size }) =>
          theme === 'dark' ? (
            <MoonIcon size={size} />
          ) : theme === 'light' ? (
            <SunIcon size={size} />
          ) : (
            <DesktopIcon size={size} />
          ),
        onClick: () =>
          event.emit('change-theme', (theme: ThemeMode) => {
            useStore.setState({ theme })
            window.api.sendState('all', 'theme', theme)
          })
      },
      {
        title: '设置',
        Icon: ({ size }) => <GearIcon size={size} />,
        onClick: () => window.api.createWindow('settings')
      }
    ]
  ]

  return (
    <div
      className="h-full bg-white dark:bg-black border-r border-gray-300 relative z-10 flex flex-col justify-between items-center drag"
      style={{ width: navBarWidth }}
    >
      {navList.map((nav, i) => (
        <div key={i} className="flex flex-col items-center">
          {nav.map(({ title, Icon, onClick }) => (
            <button
              key={title}
              className="p-2 flex items-center gap-2 cursor-pointer rounded-sm hover:text-gray-700 dark:text-white no-drag"
              onClick={onClick}
            >
              <Icon size={TITLE_BAR_ICON_SIZE} />
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
