import { initConsoleWindow, logger } from "@src/utils/logger";
import { app, nativeTheme } from "electron";
import {
  APP_PROTOCOL,
  args,
  getIconFilename,
  isDevelopment,
  isTest,
} from "@src/utils";
import { installChromeExtensions } from "@lib/electron-utils";

export default async function stage2_initialize() {
  // set dock icon for MacOS & linux
  if (app.dock) {
    app.dock.setIcon(getIconFilename(".png"));
  }

  // set app protocol client
  app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
    ...(app.isPackaged ? [] : [process.argv[1]]),
    "--",
  ]);

  logger.log(`[init::electron] args]`, args);

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

  // install extensions
  if ([isDevelopment, isTest].some(Boolean)) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }
}

async function initService() {
  const services = await import("../services").then((mod) => mod.default);
  await services.initialize();
  logger.log(`service started`);
}
