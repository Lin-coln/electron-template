import {
  BrowserWindow,
  Rectangle,
  screen,
  BrowserWindowConstructorOptions,
} from "electron";
import OpenDevToolsOptions = Electron.OpenDevToolsOptions;
import Display = Electron.Display;

export class DevToolsWindow extends BrowserWindow {
  // hostWebContents: WebContents;
  hostWindow: BrowserWindow;
  // hostOpenDevTools: (options?: OpenDevToolsOptions) => void;

  constructor(
    hostWindow: BrowserWindow,
    // hostWebContents: WebContents,
    opts: BrowserWindowConstructorOptions,
  ) {
    super({ show: false, ...opts });
    // this.hostWebContents = hostWebContents;
    this.hostWindow = hostWindow;
    this.hostWindow.on("closed", () => {
      if (!this.isDestroyed()) this.destroy();
    });
    this.hostWindow.webContents.setDevToolsWebContents(this.webContents);
    this.hostWindow.webContents.on("devtools-opened", async () => {
      this.showInactive();
    });

    // this.hostWebContents.setDevToolsWebContents(this.webContents);
    // this.hostOpenDevTools = this.hostWebContents.openDevTools.bind(
    //   this.hostWebContents,
    // );
    // Object.defineProperties(this.hostWebContents, {
    //   openDevTools: {
    //     value: this.open.bind(this),
    //   },
    // });
  }

  open(options?: OpenDevToolsOptions) {
    console.log("devtools win open");
    if (options && options.mode === "detach" && options.activate === false) {
      this.hostWindow.webContents.once("devtools-opened", async () => {
        this.showInactive();
      });
      // return this.hostOpenDevTools(options);
      this.hostWindow.webContents.openDevTools(options);
    } else {
      // return this.hostOpenDevTools(options);
      this.hostWindow.webContents.openDevTools(options);
    }
  }
}

/**
 * use custom browserWindow for devTools,
 * so that u can update its bounds and
 * use showInactive to prevent focus devToolsWindow when it opened trigger by reboot
 */

export function getBounds({
  display,
  position,
  width,
  height,
  margin,
}: {
  display: Display;
  position: "top-right" | "center" | "bottom-right";
  width: number;
  height: number;
  margin?: number;
}) {
  margin ??= 0;
  let x = display.bounds.x;
  let y = display.bounds.y;

  if (position === "center") {
    x += (display.bounds.width - width) / 2;
    y += (display.bounds.height - height) / 2;
  } else if (position === "top-right") {
    x += display.bounds.width - width;
    x -= margin;
    y += margin;
  } else if (position === "bottom-right") {
    x += display.bounds.width - width;
    y += display.bounds.height - height;
    x -= margin;
    y -= margin;
  }

  return {
    width,
    height,
    x,
    y,
  };
}
