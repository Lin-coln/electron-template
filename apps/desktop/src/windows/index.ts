import { app, BrowserWindow } from "electron";
import { getAppWindowOptions } from "./getBrowserWindowOptions";
import { args, getIconFilename, getInternalFilename } from "@src/utils";

const NO_FOCUS = args.no_focus;
const INDEX_URL = args.index_url;
const PRELOAD_FILENAME = getInternalFilename("./preload/index.cjs");
const INDEX_FILENAME = getInternalFilename("./renderer/index.html");

let mainWindow: BrowserWindow;

// export function getMainWindow(): BrowserWindow {
//   if (!mainWindow) throw new Error("Could not find main window");
//   return mainWindow;
// }

export async function initWindows() {
  // handleCreateMainWindow
  app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length !== 0) return;
    await createWindows();
  });
  await createWindows();

  async function createWindows() {
    mainWindow = await createMainWindow();
  }
}

async function createMainWindow() {
  // create window
  const mainWindow: BrowserWindow = new BrowserWindow(
    getAppWindowOptions({
      preload: PRELOAD_FILENAME,
      icon: getIconFilename(".png"),
      display: 1,
      placement: ["center", "center"],
      width: 1200,
      height: 900,
    }),
  );

  // add listeners
  app.on("before-quit", () => {
    if (mainWindow.isDestroyed()) return;

    // store window pos when before app quit
    const bounds = mainWindow.getBounds();
    // store.set(windowStateStoreKey, {
    //   width: bounds.width,
    //   height: bounds.height,
    //   x: bounds.x,
    //   y: bounds.y,
    // })

    mainWindow.destroy();
  });

  // watchShortcuts
  app.on("browser-window-created", (_, window) => {
    // optimizer.watchWindowShortcuts(window)
  });

  // load webContents
  if (INDEX_URL) {
    await mainWindow.loadURL(INDEX_URL);
  } else {
    await mainWindow.loadFile(INDEX_FILENAME);
  }

  // show
  await new Promise<void>((resolve) => {
    mainWindow.once("show", () => resolve());
    if (NO_FOCUS) {
      // no focus when reboot app from dev:main
      mainWindow.showInactive();
    } else {
      mainWindow.show();
    }
  });

  // show devTools
  // mainWindow.webContents.openDevTools({ mode: "detach" });

  console.log(`[MainWindow] window created`);
  return mainWindow;
}
