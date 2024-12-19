import { BoundsOptions, getBounds } from "./getBounds";

export function getAppWindowOptions(
  opts: BoundsOptions & {
    preload?: string;
    icon?: string;
  },
) {
  const { preload, icon, ...boundsOpts } = opts;

  const options: Electron.BrowserWindowConstructorOptions = {
    ...getBounds(boundsOpts),
    icon,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: preload,
      additionalArguments: [], // add process.argv to preload script
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      // webSecurity: !isDev,
      // devTools: isDev || isTest,
      spellcheck: false,
    },
  };
  if (process.platform === "darwin") {
    Object.assign(options, {
      frame: false,
      transparency: true,
      backgroundColor: undefined,
      titleBarStyle: "hiddenInset",
      vibrancy: "under-window", // blur
      visualEffectState: "active",
      transparent: true,
      trafficLightPosition: {
        x: 12,
        y: 12,
      },
    } as Electron.BrowserWindowConstructorOptions);
  }

  return options;
}
