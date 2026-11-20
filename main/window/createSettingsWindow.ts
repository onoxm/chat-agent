import { windowManager } from './WindowService'

export const createSettingsWindow = () => {
  const settingsWin = windowManager.create({
    windowName: 'settings'
  })
  if (settingsWin.isVisible()) {
    settingsWin.show()
  }
}
