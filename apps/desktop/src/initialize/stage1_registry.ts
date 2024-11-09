import { app } from "electron";

export default async function stage1_registry() {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  // store window position before quit
  app.on("before-quit", () => {
    // // store window pos when before app quit
    // const window = getMainWindow()
    // if (!window || window.isDestroyed()) return
    // const bounds = window.getBounds()
    //
    // store.set(windowStateStoreKey, {
    //   width: bounds.width,
    //   height: bounds.height,
    //   x: bounds.x,
    //   y: bounds.y,
    // })
  });
  // destroy window before quit
  app.on("before-quit", () => {
    // const windows = BrowserWindow.getAllWindows()
    // windows.forEach((window) => window.destroy())
  });
}
