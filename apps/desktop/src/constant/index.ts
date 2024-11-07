import { app } from "electron";
import path from "node:path";
import { getApplicationArgs } from "@lib/electron-utils";

const isPackaged = app.isPackaged;
const appPathname = app.getAppPath();

export const RESOURCES_PATH = isPackaged
  ? path.resolve(process.resourcesPath, "./resources")
  : path.resolve(appPathname, "../resources");

const args = getApplicationArgs<{
  INDEX_URL: string;
}>();

export const PRELOAD_FILENAME = isPackaged
  ? path.resolve(appPathname, "./preload/index.cjs")
  : path.resolve(appPathname, "./preload/index.cjs");

export const INDEX_URL = args.INDEX_URL ?? null;

export const INDEX_FILENAME = isPackaged
  ? path.resolve(appPathname, "./renderer/index.html")
  : path.resolve(appPathname, "./renderer/index.html");

export const ICON_FILENAME = isPackaged
  ? path.resolve(appPathname, "./resources/icons/icon.ico")
  : path.resolve(appPathname, "./resources/icons/icon.ico");
