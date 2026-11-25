import { event } from '@/event'
import { useStore } from '@/store'
import {
  ChatTextIcon,
  DesktopIcon,
  GearIcon,
  MoonIcon,
  SunIcon
} from '@phosphor-icons/react'
import { chainClassNames, Tooltip, type ThemeMode } from 'ono-react-element'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'

interface ActionItem {
  title: string
  label: string
  Icon: React.FC<{ size: number }>
  activeRule?: (pathname: string) => boolean
  onClick: () => void
}

export const NavBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const asideShow = useStore('asideShow')
  const theme = useStore('theme')

  const navList: ActionItem[][] = [
    [
      {
        title: '聊天',
        label: t('navBar.chat'),
        activeRule: (pathname: string) => pathname.includes('/chat'),
        Icon: ({ size }) => <ChatTextIcon size={size} />,
        onClick: () => {
          navigate('/chat')
          useStore.setState({
            asideShow: !asideShow
          })
        }
      }
    ],
    [
      {
        title: '主题切换',
        label: t(
          theme === 'dark'
            ? 'navBar.darkMode'
            : theme === 'light'
              ? 'navBar.lightMode'
              : 'navBar.systemMode'
        ),
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
        label: t('navBar.settings'),
        Icon: ({ size }) => <GearIcon size={size} />,
        onClick: () => window.api.createWindow('settings')
      }
    ]
  ]

  return (
    <aside className="h-full p-2.5 border-r border-line-200 relative z-10 flex flex-col justify-between items-center drag">
      {navList.map((nav, i) => (
        <div key={i} className="flex flex-col items-center">
          {nav.map(({ title, label, Icon, activeRule, onClick }) => (
            <Tooltip key={title} content={label} placement="right">
              <button
                className={chainClassNames(
                  'p-2 flex items-center gap-2 cursor-pointer rounded-[10px] no-drag',
                  activeRule?.(location.pathname)
                    ? 'text-brand-solid bg-brand-soft'
                    : 'text-ink-500'
                )}
                onClick={onClick}
              >
                <Icon size={20} />
              </button>
            </Tooltip>
          ))}
        </div>
      ))}
    </aside>
  )
}
