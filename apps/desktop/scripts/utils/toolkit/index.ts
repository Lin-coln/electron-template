import { Config } from "@scripts/utils/toolkit/interface";
import path from "node:path";

export * from "./interface";

// base
export { createMainTsupOptions } from "./createMainTsupOptions";
export { createPreloadTsupOptions } from "./createPreloadTsupOptions";
export { generatePackageJson } from "./generatePackageJson";

export function getPackDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_pack);
}
export function getBuildDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build);
}
export function getRendererDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build, "./renderer");
}
