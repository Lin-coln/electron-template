export * from "./app";
export * from "./resources";

import { getInternalFilename } from "@src/utils/resources";

/**
 * - ico: for BrowserWindow
 * - png: for docker
 */
export const getIconFilename = (ext: ".ico" | ".png") =>
  getInternalFilename(`./icons/app${ext}`);
