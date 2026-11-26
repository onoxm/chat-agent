import { ipcAction } from '@main/ipc'
import { CHANNELS, WindowName } from '@types'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import path from 'node:path'

type WindowServiceOptions = BrowserWindowConstructorOptions & {
  windowName?: WindowName
}

const basicWindowOptions: WindowServiceOptions = {
  title: 'Chat Agent',
  width: 1200,
  height: 800,
  show: false,
  minWidth: 1200,
  minHeight: 800,
  titleBarStyle: 'hidden',
  webPreferences: {
    preload: path.join(__dirname, 'preload.cjs')
  }
}

export class WindowService {
  private static instance: WindowService
  #windows: Map<WindowName, BrowserWindow>
  private constructor() {
    this.#windows = new Map()
  }

  public create(options?: WindowServiceOptions) {
    const { windowName = 'main', ...rest } = options || {}

    if (this.hasWindow(windowName)) return this.getWindow(windowName)!

    const win = new BrowserWindow({
      ...basicWindowOptions,
      ...rest
    })

    this.#loadWindow(win, windowName)

    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools()
    }

    this.#windows.set(windowName, win)

    ipcAction[windowName].on.forEach(({ channel, handle }) =>
      win.webContents.ipc.on(channel, handle)
    )

    ipcAction[windowName].handle.forEach(({ channel, handle }) =>
      win.webContents.ipc.handle(channel, handle)
    )

    win.on('close', () => {
      this.#windows.delete(windowName)
    })

    // 窗口最大化状态变化时同步给渲染进程，用于维护 URL 上的 maximized 参数
    const sendMaximized = (maximized: boolean) =>
      win.webContents.send(CHANNELS.ON_WINDOW_STATE, {
        type: 'maximized',
        data: maximized
      })

    win.on('maximize', () => sendMaximized(true))
    win.on('unmaximize', () => sendMaximized(false))

    win.once('ready-to-show', () => {
      win.show()
    })

    return win
  }

  #loadWindow(window: BrowserWindow, windowName: WindowName = 'main') {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}?window=${windowName}`)
    } else {
      window.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        { query: { window: windowName } }
      )
    }
  }

  public static getInstance(): WindowService {
    if (!WindowService.instance) {
      WindowService.instance = new WindowService()
    }
    return WindowService.instance
  }

  public hasWindow(windowName: WindowName = 'main') {
    return this.#windows.has(windowName)
  }

  public getWindow(windowName: WindowName = 'main') {
    return this.#windows.get(windowName)
  }

  public getAllWindows() {
    return Array.from(this.#windows.values())
  }

  public getWindowByWebContents(webContent: Electron.WebContents) {
    return this.getAllWindows().find(win => win.webContents === webContent)
  }
}

export const windowManager = WindowService.getInstance()
