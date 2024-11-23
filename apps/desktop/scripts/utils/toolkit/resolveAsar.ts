import { Config, RelativePath } from "./interface";
import path from "path";
import fs from "fs";
import { Context } from "@scripts/utils/toolkit/Context";

type Asar = { from: RelativePath; to: `@app/${string}` };

export async function copyAsar(cfg: Config) {
  const ctx = new Context(cfg);
  const asarList = await collectAsarList(cfg);
  const asarDir = ctx.resolveBuildFilename(".");
  for (const { from, to } of asarList) {
    const dist = path.resolve(asarDir, to.replace("@app/", ""));
    if (fs.existsSync(dist)) {
      throw new Error(
        `failed to copy file, conflict name with compiled file: ${to}`,
      );
    }
    const source = ctx.resolveFilename(from);
    await fs.promises.cp(source, dist, { recursive: true });
  }
}

async function collectAsarList(cfg: Config) {
  const ctx = new Context(cfg);
  const asarList: Asar[] = [];
  const assets = cfg.assets
    .filter((asset) => asset.type === "asar")
    // todo filename asar
    .filter((asset) => "dirname" in asset);

  for (const asset of assets) {
    const dirname = asset.source;
    const files = await fs.promises.readdir(ctx.resolveFilename(dirname));
    const dirname_asset = path.dirname(asset.dirname);
    asarList.push(
      ...files
        .filter((file) => asset.filter(file))
        .map((file) => {
          const filename = path.join(dirname, file);
          return {
            from: filename as RelativePath,
            to: path.join(dirname_asset, file) as `@app/${string}`,
          };
        }),
    );
  }
  return asarList;
}
