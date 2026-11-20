import { app, Menu, nativeImage, Tray } from 'electron'
import path from 'node:path'
import { platform } from './platform'
import { createSettingsWindow } from './window'

// 开发时图标在项目根目录，打包后由 extraResource 放到 resources/public
const getLogoPath = () =>
  app.isPackaged
    ? path.join(process.resourcesPath, 'public', 'logo.png')
    : path.join(app.getAppPath(), 'public', 'logo.png')

export const createTray = () => {
  const logo = nativeImage.createFromPath(getLogoPath())
  if (platform.isMac) logo.setTemplateImage(true)
  const tray = new Tray(logo)
  const contextMenu = Menu.buildFromTemplate([
    {
      role: 'quit'
    },
    {
      role: 'about'
    },
    {
      label: 'settings',
      icon: nativeImage.createFromPath(getLogoPath()),
      click: createSettingsWindow
    }
  ])

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
}
