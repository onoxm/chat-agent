import { HeadBar } from '@/components'
import { chainClassNames, SliderList } from 'ono-react-element'
import { useState } from 'react'
import { CommonPage } from './commonPage'
import { ModelPage } from './modelPage'

export default () => {
  const [tab, setTab] = useState('common')

  const tabList = [
    {
      label: '常规设置',
      value: 'common'
    },
    {
      label: '模型设置',
      value: 'model'
    }
  ]

  return (
    <div className="w-screen h-screen flex flex-col">
      <HeadBar />
      <SliderList
        list={tabList}
        className="flex items-center gap-4"
        slider={Slider => <Slider className="rounded-md !bg-[pink]" />}
      >
        {({ item, isActive }) => (
          <li
            key={item.value}
            className={chainClassNames(
              'w-full cursor-pointer py-1 px-2 transition-color duration-300',
              isActive ? 'text-white' : ''
            )}
            onClick={() => setTab(item.value)}
          >
            {item.label}
          </li>
        )}
      </SliderList>

      {tab === 'common' ? <CommonPage /> : <ModelPage />}
    </div>
  )
}
