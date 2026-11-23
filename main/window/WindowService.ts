import { WindowName } from '@types'
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'
import path from 'node:path'

type WindowServiceOptions = BrowserWindowConstructorOptions & {
  windowName?: WindowName
}

const basicWindowOptions: WindowServiceOptions = {
  title: 'Chat Agent',
  width: 800,
  height: 600,
  show: false,
  minWidth: 800,
  minHeight: 600,
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

    win.on('close', () => {
      this.#windows.delete(windowName)
    })

    win.once('ready-to-show', () => {
      win.show()
    })

    return win
  }

  #loadWindow(window: BrowserWindow, hash: WindowName = 'main') {
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      window.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}#${hash}`)
    } else {
      window.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
        { hash }
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
}

export const windowManager = WindowService.getInstance()
