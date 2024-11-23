import { RelativePath } from "../interface";
import path from "path";
import fs from "fs";
import { Context } from "../Context";

type FileCopy = { from: string; to: string };

export async function copyAsar(this: Context) {
  const files: FileCopy[] = [];
  const assets = this.config.assets
    .filter((asset) => asset.type === "asar")
    // todo filename asar
    .filter((asset) => "dirname" in asset);
  for (const asset of assets) {
    files.push(...(await resolveAssetDir.call(this, asset)));
  }

  for (const { from, to } of files) {
    if (fs.existsSync(to)) {
      throw new Error(
        `failed to copy file, conflict name with compiled file: ${to}`,
      );
    }
    await fs.promises.cp(from, to, { recursive: true });
  }
}

async function resolveAssetDir(
  this: Context,
  asset: {
    dirname: `@app/${string}`;
    source: RelativePath;
    filter: (file: string) => boolean;
  },
): Promise<FileCopy[]> {
  const dirname_dist = path.dirname(asset.dirname);
  const dirname_source = this.resolveFilename(asset.source);
  const files = await fs.promises.readdir(dirname_source);
  return files
    .filter((file) => asset.filter(file))
    .map((file) => ({
      from: path.join(dirname_source, file),
      to: this.resolveBuildFilename(dirname_dist, file),
    }));
}
