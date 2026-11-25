import { windowManager } from '@main/window'

export const createSettingsWindow = () => {
  const settingsWin = windowManager.create({
    windowName: 'settings',
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600
  })
  if (settingsWin.isVisible()) {
    settingsWin.show()
  }
}
