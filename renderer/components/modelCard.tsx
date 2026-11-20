import { EyeClosedIcon, EyeIcon, XCircleIcon } from '@phosphor-icons/react'
import type { ModelInfo } from '@types'
import { chainClassNames } from 'ono-react-element'
import { useState } from 'react'

interface ModelCardProps {
  label: string
  url: string
  apiKey: string
  updateModel: (modelInfo: Partial<ModelInfo>) => void
  deleteModel: () => void
}

export const ModelCard = ({
  label,
  url,
  apiKey,
  updateModel,
  deleteModel
}: ModelCardProps) => {
  const [showApiKey, setShowApiKey] = useState(false)
  const [focusApiKey, setApiKeyFocus] = useState(false)

  const cardInfo = [
    {
      label: '模型名称',
      value: label,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateModel({
          label: e.target.value
        })
    },
    {
      label: 'URL',
      value: url,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateModel({
          url: e.target.value
        })
    },
    {
      label: 'ApiKey',
      value: apiKey,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        updateModel({
          apiKey: e.target.value
        })
    }
  ]

  return (
    <div className="flex flex-col gap-2 border-2 border-gray-500 p-3 rounded-lg">
      <div className="flex justify-end">
        <button className="text-red-500" onClick={deleteModel}>
          <XCircleIcon size={28} />
        </button>
      </div>
      {cardInfo.map(({ label, value, onChange }) => (
        <div key={label} className="flex items-center gap-2">
          <p>{label}：</p>
          {label.toLocaleLowerCase() === 'apikey' ? (
            <div
              className={chainClassNames(
                'flex items-center gap-2 flex-1 py-2 px-3 bg-gray-200 rounded-lg ',
                focusApiKey
                  ? 'outline-none ring-2 ring-blue-500'
                  : 'outline-1.5 outline-gray-500'
              )}
            >
              <input
                type={showApiKey ? 'text' : 'password'}
                className="flex-1 outline-none"
                value={value}
                onChange={onChange}
                onFocus={() => setApiKeyFocus(true)}
                onBlur={() => setApiKeyFocus(false)}
              />

              <button onClick={() => setShowApiKey(!showApiKey)}>
                {showApiKey ? (
                  <EyeIcon size={24} />
                ) : (
                  <EyeClosedIcon size={24} />
                )}
              </button>
            </div>
          ) : (
            <input
              className="flex-1 py-2 px-3 outline-1.5 outline-gray-500 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={onChange}
            />
          )}
        </div>
      ))}
    </div>
  )
}
