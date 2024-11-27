import { Config } from "./interface";
import path from "node:path";
import fs from "fs";

// ...
import { copyAsar } from "./raw/resolveAsar";
import { createPackOptions } from "./raw/createPackOptions";
import { createDarwinInstallerOptions } from "./raw/createInstallerOptions";
import { createMainTsupOptions } from "./raw/createMainTsupOptions";
import { createPreloadTsupOptions } from "./raw/createPreloadTsupOptions";
import pack from "@electron/packager";
import { createDMG } from "electron-installer-dmg";
import { createRequire } from "node:module";
import child_process from "node:child_process";

export class Context {
  config: Config;
  constructor(config: Config) {
    this.config = config;
    this.copyAsar = copyAsar.bind(this);
    this.createMainTsupOptions = createMainTsupOptions.bind(this);
    this.createPreloadTsupOptions = createPreloadTsupOptions.bind(this);
  }

  // filename
  resolveFilename(...args: string[]) {
    return path.resolve(this.config.base, ...args);
  }
  resolvePackFilename(...args: string[]) {
    return this.resolveFilename(this.config.dist_pack, ...args);
  }
  resolveBuildFilename(...args: string[]) {
    let rel = path.join(...args);
    if (rel.startsWith("@app/")) {
      rel = rel.replace("@app/", "./");
    }
    return this.resolveFilename(this.config.dist_build, rel);
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // cleanup
  async cleanup() {
    const targets = [this.resolvePackFilename(), this.resolveBuildFilename()];
    await Promise.all(
      targets.map(async (dirname) => {
        if (!fs.existsSync(dirname)) return;
        await fs.promises.rm(dirname, { recursive: true });
      }),
    );
  }

  createMainTsupOptions: typeof createMainTsupOptions;

  createPreloadTsupOptions: typeof createPreloadTsupOptions;

  // generate package.json
  async generatePackageJson() {
    const cfg = this.config;
    const app = cfg.app;
    const dist = this.resolveBuildFilename("./package.json");
    const entryAsset = cfg.assets
      .filter((asset) => asset.type === "main")
      .find((asset) => asset.filename === `@app/main/index.js`);
    if (!entryAsset) {
      throw new Error(`entry not found`);
    }
    const entryFilename = this.resolveBuildFilename(entryAsset.filename);
    const content = {
      name: app.name,
      author: app.author,
      version: app.version,
      private: true,
      type: "module",
      main: path.relative(path.dirname(dist), entryFilename),
      homepage: "./",
    };
    if (!fs.existsSync(path.dirname(dist))) {
      await fs.promises.mkdir(path.dirname(dist), { recursive: true });
    }
    await fs.promises.writeFile(
      dist,
      JSON.stringify(content, null, 2),
      "utf-8",
    );
  }

  copyAsar: typeof copyAsar;

  // pack
  async packDarwin() {
    const options = await createPackOptions.call(this);
    await pack(options);
  }

  // make
  async makeDarwin() {
    const options = await createDarwinInstallerOptions.call(this);
    await createDMG(options);
  }

  // spawn electron
  async spawnElectronProcess(
    args: Record<string, string | number | boolean | undefined>,
  ) {
    const argsList = Object.entries(args)
      .filter((entry) => entry[1] !== undefined)
      .map(([key, value]) => `--${key}=${value}`);
    const electron = createRequire(this.resolveFilename("."))("electron");
    const appProcess = child_process.spawn(electron, [".", ...argsList], {
      // stdio: "inherit",
      stdio: "ignore",
      cwd: this.resolveBuildFilename(),
    });

    return appProcess;
  }
}
