import { app } from "electron";
import path from "node:path";

const isPackaged = app.isPackaged;
const appPathname = app.getAppPath();

const args: Record<string, string | boolean> = process.argv
  .slice(2)
  .filter((x) => x.startsWith("--"))
  .map((x) => {
    const [k, v] = x.split("=");
    return [k.slice(2), v] as [string, unknown];
  })
  .reduce((acc, entry) => {
    let [k, v] = entry;
    if (v === undefined) {
      v = true;
    } else if (v === "true" || v === "false") {
      v = v == "true";
    }
    acc[k] = v;
    return acc;
  }, {});

export const PRELOAD_FILENAME = isPackaged
  ? path.resolve(appPathname, "./preload/index.cjs")
  : path.resolve(appPathname, "dist", "./preload/index.cjs");

export const INDEX_URL = args.INDEX_URL ? (args.INDEX_URL as string) : null;

export const INDEX_FILENAME = isPackaged
  ? path.resolve(appPathname, "./view/index.html")
  : path.resolve(appPathname, "dist", "./view/index.html");
