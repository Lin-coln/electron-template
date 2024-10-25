import { app } from "electron";
import path from "node:path";

const isPackaged = app.isPackaged;
const appPathname = app.getAppPath();

export const PRELOAD_FILENAME = path.resolve(appPathname, "./dist/preload.js");

export const INDEX_FILENAME = path.resolve(appPathname, "./views/index.html");
