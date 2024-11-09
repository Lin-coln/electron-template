import { app } from "electron";
import path from "node:path";
import { getApplicationArgs } from "@lib/electron-utils";

const isPackaged = app.isPackaged;
const appPathname = app.getAppPath();

export const args = getApplicationArgs<{
  boot_mode: "development" | "test" | "production";
  index_url: string | null;
  no_focus: boolean;
}>({
  boot_mode: isPackaged ? "production" : "development",
  index_url: null,
  no_focus: false,
});

if (args.boot_mode === "development") {
  process.env.NODE_ENV = "development";
}

export const isDevelopment = args.boot_mode === "development";
export const isTest = args.boot_mode === "test";
export const isProduction = args.boot_mode === "production";

export const NO_FOCUS = args.no_focus;

export const PRELOAD_FILENAME = isPackaged
  ? path.resolve(appPathname, "./preload/index.cjs")
  : path.resolve(appPathname, "./preload/index.cjs");

export const INDEX_URL = args.index_url ?? null;

export const INDEX_FILENAME = isPackaged
  ? path.resolve(appPathname, "./renderer/index.html")
  : path.resolve(appPathname, "./renderer/index.html");

export const ICON_FILENAME = isPackaged
  ? path.resolve(appPathname, "./resources/icons/icon.ico")
  : path.resolve(appPathname, "./resources/icons/icon.ico");

export const RESOURCES_PATH = isPackaged
  ? path.resolve(process.resourcesPath, "./resources")
  : path.resolve(appPathname, "../resources");
