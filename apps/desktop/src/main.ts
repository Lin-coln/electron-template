import { app, BrowserWindow, screen } from "electron";
import path from "node:path";
import url from "node:url";
import {
  ICON_FILENAME,
  INDEX_FILENAME,
  INDEX_URL,
  PRELOAD_FILENAME,
} from "./constant";
import { installChromeExtensions } from "@lib/electron-utils";
import * as process from "node:process";

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

  await startup();
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
async function startup() {
  await startupService();

  if (!app.isPackaged) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }

  const mainWindow = await startupWindow();
  // services.addWebContentsPeer(mainWindow.webContents);
}

async function startupService() {
  const services = await import("./services").then((mod) => mod.default);
  await services.initialize();
  console.log(`service started`);
}

async function startupWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[displays.length > 1 ? 1 : 0];

  const { width, height } = { width: 800, height: 600 };
  const x = targetDisplay.bounds.x + (targetDisplay.bounds.width - width) / 2;
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
        x: 18,
        y: 18,
      },
    } as Electron.BrowserWindowConstructorOptions);
  }
  const mainWindow: BrowserWindow = new BrowserWindow(options);

  if (INDEX_URL) {
    await mainWindow.loadURL(INDEX_URL);
  } else {
    await mainWindow.loadFile(INDEX_FILENAME);
  }
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.show();
  console.log(`window started`);
  return mainWindow;
}
