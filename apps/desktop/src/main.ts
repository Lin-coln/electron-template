import { app, BrowserWindow, Rectangle, screen } from "electron";
import path from "node:path";
import url from "node:url";
import {
  isDevelopment,
  isTest,
  getIconFilename,
  INDEX_FILENAME,
  INDEX_URL,
  NO_FOCUS,
  PRELOAD_FILENAME,
} from "@src/utils";

import { initElectron } from "@src/init/initElectron";
import { installChromeExtensions } from "@lib/electron-utils";
import { configDevToolsWindow } from "@src/utils/configDevToolsWindow";
import * as fs from "node:fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

void main();

/**
 *
 * - init electron app;
 * - create init window;
 *   - init system services;
 *     - create windows
 *     - ...
 *   - init other services in child_process;
 * - switch to main window;
 *
 */
async function main() {
  await initElectron();

  // store window position before quit
  app.on("before-quit", () => {
    // // store window pos when before app quit
    // const window = getMainWindow()
    // if (!window || window.isDestroyed()) return
    // const bounds = window.getBounds()
    //
    // store.set(windowStateStoreKey, {
    //   width: bounds.width,
    //   height: bounds.height,
    //   x: bounds.x,
    //   y: bounds.y,
    // })
  });

  // destroy window before quit
  app.on("before-quit", () => {
    // const windows = BrowserWindow.getAllWindows()
    // windows.forEach((window) => window.destroy())
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  await app.whenReady();

  // watchShortcuts
  app.on("browser-window-created", (_, window) => {
    // optimizer.watchWindowShortcuts(window)
  });

  // setAppUserModelId

  // createMainWindow
  const mainWindow = await createMainWindow();
  const devLog = (...args) =>
    mainWindow.webContents.send(`dev#console.log`, ...args);

  // update proxy
  // registry updater

  // handleCreateMainWindow
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length !== 0) return;
    createMainWindow();
  });

  /**
   * handle open-url
   * - create or restore target window, then focus
   * - handle open action
   */
  app.on("open-url", (_, url) => {
    // if (mainWindow && !mainWindow.isDestroyed()) {
    //   if (mainWindow.isMinimized()) mainWindow.restore()
    //   mainWindow.focus()
    // } else {
    //   mainWindow = createMainWindow()
    // }
    // url && handleOpen(url)
  });

  // install extensions
  if ([isDevelopment, isTest].some(Boolean)) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }
}

async function createMainWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[displays.length > 1 ? 1 : 0];

  const { width, height } = { width: 1200, height: 900 };
  const x = targetDisplay.bounds.x + (targetDisplay.bounds.width - width) * 0.3;
  const y = targetDisplay.bounds.y + (targetDisplay.bounds.height - height) / 2;

  const options: Electron.BrowserWindowConstructorOptions = {
    icon: getIconFilename(".ico"),
    width,
    height,
    x,
    y,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: PRELOAD_FILENAME,
      additionalArguments: [], // add process.argv to preload script
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      // webSecurity: !isDev,
      // devTools: isDev || isTest,
      spellcheck: false,
    },
  };
  if (process.platform === "darwin") {
    Object.assign(options, {
      frame: false,
      transparency: true,
      backgroundColor: undefined,
      titleBarStyle: "hiddenInset",
      vibrancy: "under-window", // blur
      visualEffectState: "active",
      transparent: true,
      trafficLightPosition: {
        x: 12,
        y: 12,
      },
    } as Electron.BrowserWindowConstructorOptions);
  }
  const mainWindow: BrowserWindow = new BrowserWindow(options);

  if (INDEX_URL) {
    await mainWindow.loadURL(INDEX_URL);
  } else {
    await mainWindow.loadFile(INDEX_FILENAME);
  }

  if (NO_FOCUS) {
    const windowShowPromise = new Promise<void>((resolve) =>
      mainWindow.once("show", () => resolve()),
    );
    // no focus when reboot app from dev:main
    mainWindow.showInactive();
    await windowShowPromise;
  } else {
    mainWindow.show();
  }

  const devToolsWindow = configDevToolsWindow(mainWindow);
  mainWindow.webContents.openDevTools({ mode: "detach" });

  console.log(`[main] window started`);
  return mainWindow;
}
