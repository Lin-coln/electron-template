import { app, BrowserWindow, Rectangle, screen } from "electron";
import path from "node:path";
import url from "node:url";
import {
  ICON_FILENAME,
  INDEX_FILENAME,
  INDEX_URL,
  NO_FOCUS,
  PRELOAD_FILENAME,
} from "./utils";
import { initElectron } from "@src/init";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length !== 0) return;
    startupWindow();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

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
  await initElectron();
  const mainWindow = await startupWindow();
  // services.addWebContentsPeer(mainWindow.webContents);
});

async function startupWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[displays.length > 1 ? 1 : 0];

  const { width, height } = { width: 1200, height: 900 };
  const x = targetDisplay.bounds.x + (targetDisplay.bounds.width - width) * 0.3;
  const y = targetDisplay.bounds.y + (targetDisplay.bounds.height - height) / 2;

  const options: Electron.BrowserWindowConstructorOptions = {
    icon: ICON_FILENAME,
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

  initDevToolsWindow(mainWindow);
  mainWindow.webContents.openDevTools({ mode: "detach" });

  console.log(`[main] window started`);
  return mainWindow;
}

/**
 * use custom browserWindow for devTools,
 * so that u can update its bounds and
 * use showInactive to prevent focus devToolsWindow when it opened trigger by reboot
 */
function initDevToolsWindow(hostWindow: BrowserWindow) {
  const hostBounds = hostWindow.getBounds();
  const hostDisplay = screen.getDisplayNearestPoint({
    x: hostBounds.x,
    y: hostBounds.y,
  });
  // right placement of host window
  const devBounds: Rectangle = { x: 0, y: 0, width: 800, height: 1000 };
  devBounds.x +=
    hostBounds.x +
    hostBounds.width +
    (hostDisplay.bounds.x +
      hostDisplay.bounds.width -
      hostBounds.x -
      hostBounds.width -
      devBounds.width) /
      2;
  devBounds.y +=
    hostDisplay.bounds.y + (hostDisplay.bounds.height - devBounds.height) / 2;

  const devToolsWindow = new BrowserWindow({
    show: false,
    ...devBounds,
  });
  hostWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
  hostWindow.webContents.on("devtools-opened", async () => {
    // show win
    if (NO_FOCUS) {
      devToolsWindow.showInactive();
    } else {
      devToolsWindow.show();
    }
  });

  return devToolsWindow;
}
