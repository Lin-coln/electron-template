import { app, BrowserWindow, screen } from "electron";
import path from "node:path";
import url from "node:url";
import process from "node:process";
import { INDEX_FILENAME, PRELOAD_FILENAME } from "./constant";

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
    startup();
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  await startup();
});

async function startup() {
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
      preload: PRELOAD_FILENAME,
    },
  });

  // and load the index.html of the app.
  await mainWindow.loadFile(INDEX_FILENAME);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.show();

  console.log(PRELOAD_FILENAME);
}
