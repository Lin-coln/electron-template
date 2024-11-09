import { APP_PROTOCOL, args, getIconFilename } from "@src/utils";
import { app, nativeTheme } from "electron";

export async function initElectron() {
  console.log(`[init::electron] init electron...`);

  await quitIfSecondInstance();

  // set dock icon for MacOS & linux
  if (app.dock) {
    app.dock.setIcon(getIconFilename(".png"));
  }

  // set app protocol client
  app.setAsDefaultProtocolClient(APP_PROTOCOL, process.execPath, [
    ...(app.isPackaged ? [] : [process.argv[1]]),
    "--",
  ]);

  console.log(`[init::electron] args]`);
  console.log(args);

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
    console.log("[commandLine]", commandLine);
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
}

async function quitIfSecondInstance() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    console.log(`[init::electron] second instance, quit...`);
    app.quit();
  }
}

async function initService() {
  const services = await import("../services").then((mod) => mod.default);
  await services.initialize();
  console.log(`service started`);
}
