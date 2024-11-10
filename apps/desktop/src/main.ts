import { app, nativeTheme } from "electron";
import {
  APP_PROTOCOL,
  getIconFilename,
  isDevelopment,
  isTest,
} from "@src/utils";
import { logger } from "@src/utils/logger";
import { installChromeExtensions } from "@lib/electron-utils";
import { initWindows } from "@src/windows";

void main();

async function main() {
  let result: "quit" | "continue";

  result = await quitIfSecondInstance();
  async function quitIfSecondInstance() {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
      logger.log(`[init::stage0] restrict single instance, quit...`);
      app.quit();
      return "quit";
    } else {
      return "continue";
    }
  }

  if (result === "quit") {
    app.quit();
    return;
  }

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  // set dock icon for MacOS & linux
  if (app.dock) {
    app.dock.setIcon(getIconFilename(".png"));
  }

  // set app protocol client
  app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
    ...(app.isPackaged ? [] : [process.argv[1]]),
    "--",
  ]);

  // theme
  nativeTheme.themeSource = "system";

  // registerMenuAndContextMenu()
  // registerPushNotifications()
  // enable cache cleanup task

  /**
   * handle second instance:
   * - redirect to open-url
   */
  app.on("second-instance", (_, commandLine) => {
    logger.log("[commandLine]", commandLine);
    // if (mainWindow) {
    //   if (mainWindow.isMinimized()) mainWindow.restore()
    //   mainWindow.focus()
    // }
    //
    // const url = commandLine.pop()
    // if (url) {
    //   handleOpen(url)
    // }
  });

  // setAppUserModelId
  // update proxy
  // registry updater

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

  // init services
  const services = await import("./services").then((mod) => mod.default);
  await services.initialize();
  logger.log(`service started`);

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  await app.whenReady();

  // install extensions
  if ([isDevelopment, isTest].some(Boolean)) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }

  // init windows here
  await initWindows();
}
