import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'
import { ModelInfo } from '@types'
import { chainClassNames, OnoSelect } from 'ono-react-element'
import { useMemo, useRef, useState } from 'react'

interface ModelSelectProps {
  modelList: ModelInfo[]
  model: ModelInfo
  disabled?: boolean
  onChange: (model: ModelInfo) => void
}

// 未配置 apiKey 时走 Ollama，配置了则视为 OpenAI 兼容的云端服务
const getProvider = (model: ModelInfo) => {
  if (!model.apiKey) return 'Ollama'

  try {
    return new URL(model.url).host
  } catch {
    return 'OpenAI'
  }
}

// 取模型名首段的前两个字符作为头像占位，例如 deepseek-r1 → DE
const getModelBadge = (label: string) => {
  const [head = ''] = label.split(/[^a-zA-Z0-9]+/)

  return (head || label).slice(0, 2).toUpperCase()
}

export const ModelSelect = ({
  modelList,
  model,
  disabled = false,
  onChange
}: ModelSelectProps) => {
  const [open, setOpen] = useState(false)

  const anchorRef = useRef<HTMLDivElement>(null)

  const options = useMemo(
    () => modelList.map(item => ({ label: item.label, value: item })),
    [modelList]
  )

  // OnoSelect 按 value 引用比对选中项，统一取 options 里的同一个对象，避免 store 中的对象引用不同导致选中态丢失
  const selected = useMemo(
    () => options.find(({ value }) => value.label === model.label)?.value,
    [options, model.label]
  )

  return (
    <div
      ref={anchorRef}
      className="model-select-anchor relative inline-flex h-7 items-center"
    >
      <div
        aria-hidden
        className={chainClassNames(
          'flex h-full items-center gap-1.5 rounded-2 border px-2 text-[11px] font-500 text-ink-700 transition-colors',
          disabled ? 'opacity-60' : '',
          open
            ? 'border-line-300 bg-surface-base'
            : 'border-line-200 bg-surface-subtle'
        )}
      >
        <span className="max-w-35 truncate">{model.label}</span>
        <CaretDownIcon
          size={12}
          className={chainClassNames(
            'text-ink-400 transition-transform duration-150',
            open ? 'rotate-180' : ''
          )}
        />
      </div>

      {/* 视觉层在上面渲染，OnoSelect 只保留透明的点击热区与弹层能力 */}
      <div className="model-select-overlay absolute inset-0">
        <OnoSelect
          options={options}
          defaultValue={selected}
          disabled={disabled}
          isShowArrow={false}
          classNames={{
            select: 'model-select-trigger',
            panel: 'model-select-panel'
          }}
          styles={{
            select: { color: 'transparent', caretColor: 'transparent' }
          }}
          onChange={onChange}
          onDropdownVisibleChange={setOpen}
          getPopupContainer={() => anchorRef.current}
        >
          {(option, isSelected) => (
            <div
              className={chainClassNames(
                'flex items-center gap-2.5 rounded-[9px] px-2 py-1.5 text-left transition-colors',
                isSelected ? 'bg-brand-soft' : 'hover:bg-surface-subtle'
              )}
            >
              <span
                className={chainClassNames(
                  'flex size-6.5 shrink-0 items-center justify-center rounded-2 border text-[9.5px] font-600 tracking-wide',
                  isSelected
                    ? 'border-brand-200 bg-brand-soft text-brand-700'
                    : 'border-line-200 bg-surface-subtle text-ink-500'
                )}
              >
                {getModelBadge(option.value.label)}
              </span>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-[12px] font-500 text-ink-900">
                  {option.value.label}
                </span>
                <span className="truncate text-[10.5px] text-ink-400">
                  {getProvider(option.value)}
                </span>
              </span>

              {isSelected && (
                <CheckIcon size={14} className="shrink-0 text-brand-solid" />
              )}
            </div>
          )}
        </OnoSelect>
      </div>
    </div>
  )
}
