import { BoundsOptions, getBounds } from "@src/utils/window/getBounds";
import { getIconFilename, PRELOAD_FILENAME } from "@src/utils";

export function getAppWindowOptions(
  opts: BoundsOptions & {
    preload?: string;
  },
) {
  const { preload, ...boundsOpts } = opts;

  const options: Electron.BrowserWindowConstructorOptions = {
    ...getBounds(boundsOpts),
    icon: getIconFilename(".ico"),
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

export function getDevWindowOptions(
  opts: BoundsOptions & {
    preload?: string;
  },
) {
  const { preload, ...boundsOpts } = opts;

  const options = {
    ...getBounds(boundsOpts),
    icon: getIconFilename(".ico"),
    show: false,
    webPreferences: {
      preload,
    },
  } as Electron.BrowserWindowConstructorOptions;

  return options;
}
