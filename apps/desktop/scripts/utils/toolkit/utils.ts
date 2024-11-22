import { Config } from "./interface";
import path from "node:path";

export function getPackDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_pack);
}

export function getBuildDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build);
}

export function getMainDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build, "./main");
}

export function getPreloadDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build, "./preload");
}

export function getRendererDirname(cfg: Config) {
  return path.resolve(cfg.base, cfg.dist_build, "./renderer");
}
