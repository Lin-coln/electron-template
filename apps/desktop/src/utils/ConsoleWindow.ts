import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  screen,
} from "electron";
import { getIconFilename, getInternalFilename } from "@src/utils/index";
import { DevToolsWindow, getBounds } from "@src/utils/configDevToolsWindow";
import { logger } from "@src/utils/logger";

export class ConsoleWindow extends BrowserWindow {
  static async create() {
    const displays = screen.getAllDisplays();
    const display = displays[displays.length > 1 ? 1 : 0];
    const win = new this({
      ...getBounds({
        display,
        position: "top-right",
        width: 320,
        height: 280,
      }),
    });
    app.on("before-quit", () => {
      if (win.isDestroyed()) return;
      win.destroy();
    });
    await win.loadFile(getInternalFilename("./debug/console.win.html"));
    await new Promise<void>((resolve) =>
      win.once("ready-to-show", () => resolve()),
    );
    const devToolsWindow = new DevToolsWindow(
      win,
      getBounds({
        display,
        position: "top-right",
        width: 800,
        height: 600,
        margin: 76,
      }),
    );
    win.webContents.openDevTools({ mode: "detach" });
    win.showInactive();
    return win;
  }

  private constructor(opts: BrowserWindowConstructorOptions) {
    const options: Electron.BrowserWindowConstructorOptions = {
      icon: getIconFilename(".ico"),
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: getInternalFilename("./debug/console.pre.cjs"),
        additionalArguments: [],
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false,
        webSecurity: true,
        // webSecurity: !isDev,
        // devTools: isDev || isTest,
        spellcheck: false,
      },
    };
    super(Object.assign(options, opts));
  }

  log(...args: any[]) {
    this.webContents.send(`ConsoleWindow#console`, "log", ...args);
  }
}
