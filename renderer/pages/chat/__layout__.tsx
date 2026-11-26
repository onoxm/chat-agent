import { AsidePanel, ConversationGroup } from '@/components'
import { useStore } from '@/store'
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react'
import { chainClassNames, useKeyPress } from 'ono-react-element'
import { useRef, useState } from 'react'
import { Outlet, useMatch, useNavigate } from 'react-router'

const conversations = [
  { title: 'LangGraph 流式输出排查', time: '20:41', id: '123' }
]

export default () => {
  const match = useMatch('/chat/:conversationId')
  const navigate = useNavigate()
  const { asideShow, asideWidth } = useStore(['asideWidth', 'asideShow'])

  const [search, setSearch] = useState('')

  const searchRef = useRef<HTMLInputElement>(null)

  useKeyPress('commandorcontrol+n', event => {
    event.preventDefault()
    navigate('/chat/new')
  })

  useKeyPress('commandorcontrol+k', event => {
    event.preventDefault()
    searchRef.current?.focus()
  })

  const keyword = search.trim().toLowerCase()
  const filteredConversations = conversations.filter(({ title }) =>
    title.toLowerCase().includes(keyword)
  )

  return (
    <>
      <AsidePanel>
        {resizing => (
          <div
            className={chainClassNames(
              'h-full p-2.5 pt-3 absolute left-0 top-0',
              resizing ? '' : 'transition-transform duration-300'
            )}
            style={{
              width: asideWidth,
              transform: `translateX(${asideShow ? 0 : -asideWidth}px)`
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/chat/new')}
              className="mb-2 flex h-[38px] w-full items-center gap-2 rounded-[10px] bg-brand-solid px-2.5 text-[12.5px] font-600 text-on-brand shadow-[0_8px_18px_-10px_var(--color-brand-solid)] transition-colors hover:bg-brand-solid-hover"
            >
              <PlusIcon size={16} className="shrink-0" />
              <span>新对话</span>

              <kbd className="ml-auto shrink-0 whitespace-nowrap rounded-[5px] bg-[rgba(255,255,255,0.18)] px-1.25 py-1 text-[10px] font-500 leading-none">
                Ctrl N
              </kbd>
            </button>

            <label className="mb-1 flex h-[34px] w-full items-center gap-1.75 rounded-[9px] border border-line-200 bg-surface-base px-2.25 text-ink-400 transition-colors focus-within:border-brand-solid focus-within:shadow-[0_0_0_3px_var(--color-brand-softer)]">
              <MagnifyingGlassIcon size={15} className="shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={event => setSearch(event.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent text-[12px] text-ink-900 outline-none placeholder:text-ink-400"
                placeholder={'搜索对话'}
              />
              <kbd className="shrink-0 whitespace-nowrap rounded-[5px] bg-surface-subtle px-1.25 py-1 text-[10px] font-500 leading-none text-ink-400">
                Ctrl K
              </kbd>
            </label>

            <div className="w-full flex flex-col">
              {filteredConversations.length ? (
                <ConversationGroup
                  activeId={match?.params.conversationId}
                  groupTitle={'今天'}
                  conversations={filteredConversations}
                  onClick={id => navigate(`/chat/${id}`)}
                />
              ) : (
                <p className="px-2 py-1.5 text-[11px] text-ink-400">
                  没有匹配的对话
                </p>
              )}
            </div>
          </div>
        )}
      </AsidePanel>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Outlet />
      </div>
    </>
  )
}
