import {
  BrowserWindow,
  Rectangle,
  screen,
  BrowserWindowConstructorOptions,
} from "electron";
import OpenDevToolsOptions = Electron.OpenDevToolsOptions;

class DevToolsWindow extends BrowserWindow {
  // hostWebContents: WebContents;
  hostWindow: BrowserWindow;
  // hostOpenDevTools: (options?: OpenDevToolsOptions) => void;

  constructor(
    opts: BrowserWindowConstructorOptions,
    // hostWebContents: WebContents,
    hostWindow: BrowserWindow,
  ) {
    super(opts);
    // this.hostWebContents = hostWebContents;
    this.hostWindow = hostWindow;
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
export function configDevToolsWindow(hostWindow: BrowserWindow) {
  const hostBounds = hostWindow.getBounds();
  const hostDisplay = screen.getDisplayNearestPoint({
    x: hostBounds.x,
    y: hostBounds.y,
  });
  // right placement of host window
  const devBounds: Rectangle = { x: 0, y: 0, width: 800, height: 1000 };
  devBounds.x +=
    hostBounds.x +
    hostBounds.width +
    (hostDisplay.bounds.x +
      hostDisplay.bounds.width -
      hostBounds.x -
      hostBounds.width -
      devBounds.width) /
      2;
  devBounds.y +=
    hostDisplay.bounds.y + (hostDisplay.bounds.height - devBounds.height) / 2;

  const devToolsWindow = new DevToolsWindow(
    { show: false, ...devBounds },
    hostWindow,
  );

  return devToolsWindow;
}
