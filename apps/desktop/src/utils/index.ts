export * from "./app";
export * from "./resources";

import { args } from "@src/utils/app";
import { getExternalFilename, getInternalFilename } from "@src/utils/resources";

export const NO_FOCUS = args.no_focus;
export const INDEX_URL = args.index_url;
export const CACHE_PATH = getExternalFilename("./.cache");
export const PRELOAD_FILENAME = getInternalFilename("./preload/index.cjs");
export const INDEX_FILENAME = getInternalFilename("./renderer/index.html");

/**
 * - ico: for BrowserWindow
 * - png: for docker
 */
export const getIconFilename = (ext: ".ico" | ".png") =>
  getInternalFilename(`./icons/icon${ext}`);
