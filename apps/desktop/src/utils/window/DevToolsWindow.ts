import { BrowserWindow } from "electron";
import { getDevWindowOptions } from "@src/utils/window";

/**
 * use custom browserWindow for devTools,
 * so that u can update its bounds and
 * use showInactive to prevent focus devToolsWindow when it opened trigger by reboot
 */
export class DevToolsWindow extends BrowserWindow {
  hostWindow: BrowserWindow;
  constructor(
    hostWindow: BrowserWindow,
    opts: Parameters<typeof getDevWindowOptions>[0],
  ) {
    super({
      ...getDevWindowOptions(opts),
    });
    this.hostWindow = hostWindow;
    this.hostWindow.on("closed", () => {
      if (!this.isDestroyed()) this.destroy();
    });
    this.hostWindow.webContents.setDevToolsWebContents(this.webContents);
    this.hostWindow.webContents.on("devtools-opened", async () => {
      this.showInactive();
    });
  }

  open() {
    this.hostWindow.webContents.openDevTools({
      mode: "detach",
    });
  }
}
