import { ModelCard } from '@/components'
import { useStore } from '@/store'
import { DownloadSimpleIcon, ExportIcon, PlusIcon } from '@phosphor-icons/react'
import { ModelInfo } from '@types'
import { toast } from 'ono-react-element'

export const ModelPage = () => {
  const { modelList, encryptionPassphrase } = useStore([
    'modelList',
    'encryptionPassphrase'
  ])

  const updateModel = (modelInfo: Partial<ModelInfo>, index: number) => {
    const newModelList = [...modelList]
    newModelList[index] = { ...newModelList[index], ...modelInfo }

    if (modelList.length === 0)
      window.api.sendState('main', 'defaultModel', newModelList[index].label)

    useStore.setState({ modelList: newModelList })

    window.api.sendState('main', 'modelList', newModelList)
  }

  const deleteModel = (index: number) => {
    const newModelList = modelList.filter((_, i) => i !== index)

    useStore.setState({ modelList: newModelList })

    window.api.sendState('main', 'modelList', newModelList)

    if (newModelList.length === 0)
      window.api.sendState('main', 'defaultModel', '')
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        <span>模型设置</span>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 cursor-pointer px-2 py-1 bg-blue-500 text-white rounded-lg"
            onClick={async () => {
              const modelList =
                (await window.api.importConfig()) as unknown as ModelInfo[]

              if (!modelList) return
              useStore.setState({ modelList })
              toast.success('导入成功')
            }}
          >
            <DownloadSimpleIcon size={16} />
            导入配置
          </button>

          <button
            className="flex items-center gap-1 cursor-pointer px-2 py-1 bg-blue-500 text-white rounded-lg"
            onClick={async () => {
              await window.api.exportConfig('E:\\desktop', modelList)

              toast.success('导出成功')
            }}
          >
            <ExportIcon size={16} />
            导出配置
          </button>

          <button
            className="flex items-center gap-1 cursor-pointer px-2 py-1 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              const lastModel = modelList[modelList.length - 1]
              if (
                lastModel.apiKey === '' ||
                lastModel.url === '' ||
                lastModel.label === ''
              )
                return toast.warning('请填写好模型的完整信息')
              useStore.setState(({ modelList }) => ({
                modelList: [...modelList, { label: '', url: '', apiKey: '' }]
              }))
            }}
          >
            <PlusIcon size={16} />
            新增
          </button>
        </div>
      </div>

      {modelList.map(({ label, url, apiKey }, i) => (
        <ModelCard
          key={i}
          label={label}
          url={url}
          apiKey={apiKey}
          updateModel={model => updateModel(model, i)}
          deleteModel={() => deleteModel(i)}
          password={encryptionPassphrase}
        />
      ))}
    </div>
  )
}
