import path from 'path'
import {BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen} from 'electron'
import { enable as enableRemote } from '@electron/remote/main'

import { log } from '../log'
import routes from '@/src/auto-routes'
import {autoUpdater} from "electron-updater";

const { NODE_ENV, port, host } = process.env

/** 创建新窗口相关选项 */
export interface CreateWindowOptions {
  /** 路由启动参数 */
  params?: Record<string, any>
  /** URL 启动参数 */
  query?: Record<string, any>
  /** BrowserWindow 选项 */
  windowOptions?: BrowserWindowConstructorOptions
  /** 窗口启动参数 */
  createConfig?: CreateConfig
  isInit?:boolean
}

/** 已创建的窗口列表 */
export const windowList: Map<RouteName, BrowserWindow> = new Map()

/**
 * 通过 routes 中的 key(name) 得到 url
 * @param key
 */
export function getWindowUrl(key: RouteName, options: CreateWindowOptions = {}): string {
  let routePath = routes.get(key)?.path

  if (typeof routePath === 'string' && options.params) {
    routePath = routePath.replace(/\:([^\/]+)/g, (_, $1) => {
      return options.params?.[$1]
    })
  }

  const query = options.query ? $tools.toSearch(options.query) : ''

  if (NODE_ENV === 'development') {
    return `http://${host}:${port}#${routePath}${query}`
  } else {
    return `file://${path.join(__dirname, '../renderer/index.html')}#${routePath}${query}`
  }
}

/**
 * 创建一个新窗口
 * @param key
 * @param options
 */
export function createWindow(key: RouteName, options: CreateWindowOptions = {}): Promise<BrowserWindow> {
  return new Promise((resolve) => {
    const routeConfig: RouteConfig | AnyObj = routes.get(key) || {}

    const windowOptions: BrowserWindowConstructorOptions = {
      ...$tools.DEFAULT_WINDOW_OPTIONS, // 默认新窗口选项
      ...routeConfig.windowOptions, // routes 中的配置的window选项
      ...options.windowOptions, // 调用方法时传入的选项
    }
    let splash: BrowserWindow | undefined;
    if (options.isInit) {
      splash = createSplashWindow();
      splash.on('closed', () => (splash = undefined));
      windowOptions.show = false;
    }

    const createConfig: CreateConfig = {
      ...$tools.DEFAULT_CREATE_CONFIG,
      ...routeConfig.createConfig,
      ...options.createConfig,
    }

    if (createConfig.showCustomTitlebar) {
      windowOptions.frame = false
    }

    let activeWin: BrowserWindow | boolean
    if (createConfig.single) {
      activeWin = activeWindow(key)
      if (activeWin) {
        resolve(activeWin)
        return activeWin
      }
    }

    const win = new BrowserWindow(windowOptions)

    const url = getWindowUrl(key, options)
    windowList.set(key, win)
    win.loadURL(url)

    if (createConfig.saveWindowBounds) {
      const { rect } = $tools.settings.windowBounds.get(key) || {}
      if (rect) win.setBounds(rect)
      // if (maximized) win.maximize()
    }

    if (createConfig.hideMenus) win.setMenuBarVisibility(false)
    if (createConfig.created) createConfig.created(win)

    enableRemote(win.webContents)
    ipcMain.on('get-proctor', async () => {
      try {
        const usbList: any[] = [];
        const displays = screen.getAllDisplays();

        // const drives = await drivelist.list();
        // const removables = drives.filter((a) => a.isUSB === true);
        // usbList = await usbDetect.find();

        const dt = new Date().toLocaleTimeString();

        win.webContents.send('update-proctor', [
          dt,
          displays.length,
          win.isMaximized(),
          usbList.map((x) => x.deviceName).toString(),
        ]);

        // const violations: string[] = [];
        // if (displays.length > 1) {
        //   violations.push('Nhiều màn hình');
        // }
        // if (!win.isMaximized()) {
        //   violations.push('Không phóng to cửa sổ');
        // }
        // if (violations.length > 0) {
        //   desktopCapturer
        //     .getSources({
        //       types: ['screen'],
        //       thumbnailSize: { width: 640, height: 480 },
        //     })
        //     .then((sources) => {
        //       evidence.push({
        //         img: sources.map((a) => a.thumbnail.toBitmap()),
        //         violations: violations,
        //         timestamp: new Date().toLocaleTimeString(),
        //       });
        //     });
        // }
      } catch (error) {
        console.log(`error`, JSON.stringify(error));
      }
    });
    win.webContents.on('dom-ready', () => {
      win.webContents.send('dom-ready', createConfig)
    })

    win.webContents.on('did-finish-load', () => {
      if (options.isInit) {
        splash && !splash.isDestroyed() && splash.close();
        win.maximize();
        win.focus();
        return resolve(win);
      }
      if (createConfig.autoShow) {
        if (createConfig.delayToShow) {
          setTimeout(() => {
            win.show()
          }, createConfig.delayToShow)
        } else {
          win.show()
        }
      }
      resolve(win)
    })

    win.once('ready-to-show', () => {
      if (createConfig.openDevTools) win.webContents.openDevTools()
    })

    win.once('show', () => {
      log.info(`Window <${key}:${win.id}> url: ${url} opened.`)
    })

    win.on('close', () => {
      if (createConfig.saveWindowBounds && win) {
        const maximized = win.isMaximized()
        const rect = maximized ? $tools.settings.windowBounds.get(key)?.rect : win.getBounds()
        $tools.settings.windowBounds.set(key, { rect, maximized })
      }
      windowList.delete(key)
      log.info(`Window <${key}:${win.id}> closed.`)
    })
  })
}

/**
 * 激活一个已存在的窗口, 成功返回 BrowserWindow 失败返回 false
 * @param key
 */
export function activeWindow(key: RouteName): BrowserWindow | false {
  const win: BrowserWindow | undefined = windowList.get(key)

  if (win) {
    win.show()
    return win
  } else {
    return false
  }
}
export function createSplashWindow(): BrowserWindow {
  const splash = new BrowserWindow({
    width: 500,
    height: 280,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
  });
  const url = `file://${path.join(__dirname, '../../assets/splash.html')}`;
  splash.loadURL(url);
  return splash;
}
