import { useStore } from '@/store'
import { type CommunicationType } from '@types'
import { toast } from 'ono-react-element'
import { useTranslation } from 'react-i18next'

const CONFIG_FILENAME = 'chat-agent-config.json'

export const CommonPage = () => {
  const { i18n } = useTranslation()

  const handleExport = async () => {
    try {
      const savedPath = await window.api.exportConfig(
        '',
        useStore.getState(),
        CONFIG_FILENAME
      )
      if (savedPath) toast.success(`配置已导出到 ${savedPath}`)
    } catch (e) {
      console.error(e)
      toast.error('导出配置失败')
    }
  }

  const handleImport = async () => {
    try {
      const imported = await window.api.importConfig()
      if (!imported) return

      const current = useStore.getState()
      // 只接受 store 中已存在的字段，避免导入文件塞入无关数据
      const patch = Object.fromEntries(
        Object.entries(imported).filter(([key]) => key in current)
      ) as Partial<typeof current>

      useStore.setState(patch)

      // 各窗口的状态是独立的内存副本，导入后需要通知其他窗口
      for (const type of Object.keys(patch) as CommunicationType[])
        window.api.sendState('all', type, patch[type])

      toast.success('配置导入成功')
    } catch (e) {
      console.error(e)
      toast.error('导入配置失败')
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="w-full cursor-pointer"
        onClick={() => {
          const nextLanguage = i18n.language === 'en' ? 'zh' : 'en'
          i18n.changeLanguage(nextLanguage)
          useStore.setState({ language: nextLanguage })
          window.api.sendState('all', 'language', nextLanguage)
        }}
      >
        {i18n.language === 'en' ? 'en' : '中文'}
      </button>

      <button className="w-full cursor-pointer" onClick={handleExport}>
        导出配置
      </button>
      <button className="w-full cursor-pointer" onClick={handleImport}>
        导入配置
      </button>
    </div>
  )
}
