import { Config } from "./interface";
import path from "node:path";

export class Context {
  config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  // filename
  resolveFilename(...args: string[]) {
    return path.resolve(this.config.base, ...args);
  }
  resolvePackFilename(...args: string[]) {
    return this.resolveFilename(this.config.dist_pack, ...args);
  }
  resolveBuildFilename(...args: string[]) {
    return this.resolveFilename(this.config.dist_build, ...args);
  }
  resolveMainFilename(...args: string[]) {
    return this.resolveBuildFilename("./main", ...args);
  }
  resolvePreloadFilename(...args: string[]) {
    return this.resolveBuildFilename("./preload", ...args);
  }
  resolveRendererFilename(...args: string[]) {
    return this.resolveBuildFilename("./renderer", ...args);
  }
}
