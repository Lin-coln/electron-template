import { app, BrowserWindow, screen } from "electron";
import path from "node:path";
import url from "node:url";
import { INDEX_FILENAME, INDEX_URL, PRELOAD_FILENAME } from "./constant";

import services from "./services";

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
  const mainWindow = await startupWindow();
  // services.addWebContentsPeer(mainWindow.webContents);
}

async function startupService() {
  //
  // const services = await import("./services").then((mod) => mod.default);
  await services.initialize();
  console.log(`service started`);
}

async function startupWindow() {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[displays.length > 1 ? 1 : 0];

  const { width, height } = { width: 800, height: 600 };
  const x = targetDisplay.bounds.x + (targetDisplay.bounds.width - width) / 2;
  const y = targetDisplay.bounds.y + (targetDisplay.bounds.height - height) / 2;

  // Create the browser window.
  const mainWindow: BrowserWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: PRELOAD_FILENAME,
    },
  });

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
