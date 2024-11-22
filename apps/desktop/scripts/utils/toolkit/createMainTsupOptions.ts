import { Options } from "tsup";
import path from "node:path";
import { Config, RelativePath } from "./interface";
import { getMainDirname } from "@scripts/utils/toolkit/utils";

export function createMainTsupOptions(cfg: Config): Options {
  const assets = cfg.assets.filter((asset) => asset.type === "main");
  const opts = cfg.options.main;
  return {
    entry: Object.fromEntries(
      assets.map((asset) => {
        const relativePath: RelativePath = `./${asset.filename.replace("@app/main/", "")}`;
        const ext = path.extname(relativePath);
        const key = relativePath.slice(2, relativePath.length - ext.length);
        const value = path.resolve(cfg.base, asset.input);
        return [key, value];
      }),
    ),
    outDir: getMainDirname(cfg),
    tsconfig: path.resolve(cfg.base, opts.tsconfig),
    dts: false,
    format: ["esm"],
    target: "esnext",
    minify: false,
    clean: true,
    // splitting: false,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: opts.noExternal,
  };
}
