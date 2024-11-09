import { app, BrowserWindow, Rectangle, screen } from "electron";
import {
  getIconFilename,
  INDEX_FILENAME,
  INDEX_URL,
  NO_FOCUS,
  PRELOAD_FILENAME,
} from "@src/utils";

import { DevToolsWindow, getBounds } from "@src/utils/configDevToolsWindow";

import stage2_initialize from "@src/initialize/stage2_initialize";
import stage1_registry from "@src/initialize/stage1_registry";
import stage0_check from "@src/initialize/stage0_check";

import { initConsoleWindow, logger } from "@src/utils/logger";

void main();

async function main() {
  await stage0_check();
  await stage1_registry();

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  await app.whenReady();

  // createLoadingWindow

  await stage2_initialize();

  // handleCreateMainWindow
  app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length !== 0) return;
    await createWindows();
  });

  await createWindows();
}

async function createWindows() {
  const mainWindow = await createMainWindow();
  const consoleWindow = await initConsoleWindow();
  mainWindow.on("closed", () => {
    consoleWindow.destroy();
  });
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

  // watchShortcuts
  app.on("browser-window-created", (_, window) => {
    // optimizer.watchWindowShortcuts(window)
  });

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

  const devToolsWindow = new DevToolsWindow(
    mainWindow,
    getBounds({
      display: targetDisplay,
      position: "bottom-right",
      margin: 76,
      width: 800,
      height: 600,
    }),
  );
  mainWindow.webContents.openDevTools({ mode: "detach" });
  logger.log(`[main] window created`);
  return mainWindow;
}
