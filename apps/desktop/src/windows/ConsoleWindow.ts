import { app, BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { getIconFilename, getInternalFilename } from "@src/utils";
import { DevToolsWindow } from "@src/utils/window";
import { getBounds, getDevWindowOptions } from "@src/utils/window";
import { logger } from "@src/utils/logger";

export class ConsoleWindow extends BrowserWindow {
  static instance: ConsoleWindow | null = null;

  static async create() {
    if (this.instance && !this.instance.isDestroyed()) return this.instance;

    const win = new this(
      getDevWindowOptions({
        preload: getInternalFilename("./debug/console.pre.cjs"),
        display: 1,
        placement: ["right", "top"],
        width: 320,
        height: 280,
      }),
    );
    this.instance = win;

    const interval = setInterval(() => {
      if (logger.queue.length === 0) return;
      const item = logger.queue.shift()!;
      win.log(...item.args);
    }, 100);
    win.on("close", () => {
      clearInterval(interval);
    });

    app.on("before-quit", () => {
      if (win.isDestroyed()) return;
      win.destroy();
    });
    await win.loadFile(getInternalFilename("./debug/console.win.html"));
    win.showInactive();

    new DevToolsWindow(win, {
      display: 1,
      placement: ["right", "top"],
      width: 800,
      height: 600,
      margin: 76,
    }).open();

    return win;
  }

  log(...args: any[]) {
    this.webContents.send(`ConsoleWindow#console`, "log", ...args);
  }
}
