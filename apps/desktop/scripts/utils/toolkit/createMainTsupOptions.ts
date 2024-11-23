import { Options } from "tsup";
import path from "node:path";
import { Config, RelativePath } from "./interface";
import { Context } from "@scripts/utils/toolkit/Context";

export function createMainTsupOptions(cfg: Config): Options {
  const ctx = new Context(cfg);

  const assets = cfg.assets.filter((asset) => asset.type === "main");
  const opts = cfg.options.main;
  return {
    entry: Object.fromEntries(
      assets.map((asset) => {
        const relativePath: RelativePath = `./${asset.filename.replace("@app/main/", "")}`;
        const ext = path.extname(relativePath);
        const key = relativePath.slice(2, relativePath.length - ext.length);
        const value = ctx.resolveFilename(asset.input);
        return [key, value];
      }),
    ),
    outDir: ctx.resolveMainFilename(),
    tsconfig: ctx.resolveFilename(opts.tsconfig),
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
