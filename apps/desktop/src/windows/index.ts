import { app, BrowserWindow } from "electron";
import {
  DevToolsWindow,
  getAppWindowOptions,
  getDevWindowOptions,
} from "@src/utils/window";
import {
  getIconFilename,
  getInternalFilename,
  INDEX_FILENAME,
  INDEX_URL,
  NO_FOCUS,
  PRELOAD_FILENAME,
} from "@src/utils";
import { logger } from "@src/utils/logger";

export async function initWindows() {
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
  const consoleWindow = await createConsoleWindow();
  const mainWindow = await createMainWindow();

  mainWindow.on("closed", () => {
    consoleWindow.destroy();
  });
}

async function createConsoleWindow() {
  // create window
  const consoleWindow: BrowserWindow = new BrowserWindow({
    ...getDevWindowOptions({
      display: 1,
      placement: ["right", "top"],
      width: 320,
      height: 280,
      icon: getIconFilename(".png"),
      preload: getInternalFilename("./debug/console.pre.cjs"),
    }),
    closable: false,
  });

  // add listeners
  app.on("before-quit", () => {
    if (consoleWindow.isDestroyed()) return;

    // store window pos when before app quit
    const bounds = consoleWindow.getBounds();
    // store.set(windowStateStoreKey, {
    //   width: bounds.width,
    //   height: bounds.height,
    //   x: bounds.x,
    //   y: bounds.y,
    // })

    consoleWindow.destroy();
  });

  // init features
  let interval: NodeJS.Timeout;
  consoleWindow.on("close", () => {
    interval && clearInterval(interval);
  });
  consoleWindow.webContents.on("did-finish-load", () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (logger.queue.length === 0) return;
      const item = logger.queue.shift()!;
      try {
        consoleWindow.webContents.send(
          `ConsoleWindow#console`,
          "log",
          ...item.args,
        );
      } catch {
        logger.queue.unshift(item);
      }
    }, 100);
  });

  // load webContents
  await consoleWindow.loadFile(getInternalFilename("./debug/console.win.html"));
  // consoleWindow.showInactive();

  // show devTools
  const devToolsWindow = new DevToolsWindow(consoleWindow, {
    display: 1,
    placement: ["right", "top"],
    width: 800,
    height: 600,
    margin: 76,
    closable: false,
    icon: getIconFilename(".png"),
  });
  devToolsWindow.webContents.once("did-finish-load", () => {
    devToolsWindow.setTitle("Console Window");
  });

  consoleWindow.setParentWindow(devToolsWindow);
  void [
    "show",
    "focus",
    "maximize",
    "unmaximize",
    "blur",
    "minimize",
    "restore",
  ].forEach((event) =>
    consoleWindow.on(event as any, () => consoleWindow.hide()),
  );
  consoleWindow.on("hide", () => {
    devToolsWindow.open();
  });

  devToolsWindow.open();
  logger.log(`[ConsoleWindow] window created`);
  return consoleWindow;
}

async function createMainWindow() {
  // create window
  const mainWindow: BrowserWindow = new BrowserWindow(
    getAppWindowOptions({
      preload: PRELOAD_FILENAME,
      icon: getIconFilename(".png"),
      display: 1,
      placement: [0.3, "center"],
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

  // show devTools
  const devToolsWindow = new DevToolsWindow(mainWindow, {
    icon: getIconFilename(".png"),
    display: 1,
    placement: ["right", "bottom"],
    margin: 76,
    width: 800,
    height: 600,
  });
  devToolsWindow.open();
  devToolsWindow.webContents.once("did-finish-load", () => {
    devToolsWindow.setTitle(`DevTools (MainWindow)`);
  });
  logger.log(`[MainWindow] window created`);
  return mainWindow;
}
