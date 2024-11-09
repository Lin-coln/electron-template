import { app, BrowserWindow, screen } from "electron";
import { logger } from "@src/utils/logger";

export default async function stage0_check() {
  const beforeQuit = () => {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((window) => window.destroy());
  };
  const windowAllClosed = () => {
    if (process.platform !== "darwin") app.quit();
  };

  app.on("before-quit", beforeQuit);
  app.on("window-all-closed", windowAllClosed);
  await quitIfSecondInstance();
  app.off("before-quit", beforeQuit);
  app.off("window-all-closed", windowAllClosed);
}

async function quitIfSecondInstance() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    logger.log(`[init::stage0] restrict single instance, quit...`);
    app.quit();
  }
}
