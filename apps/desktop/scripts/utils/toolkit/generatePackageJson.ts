import { Config } from "./interface";
import path from "node:path";
import fs from "fs";

export async function generatePackageJson(cfg: Config) {
  const app = cfg.app;
  const dist = path.resolve(cfg.base, cfg.dist_build, "./package.json");

  const entryAsset = cfg.assets
    .filter((asset) => asset.type === "main")
    .find((asset) => asset.filename === `@app/main/index.js`);
  if (!entryAsset) {
    throw new Error(`entry not found`);
  }

  const entryFilename = path.resolve(
    cfg.base,
    cfg.dist_build,
    entryAsset.filename.replace("@app/main/", "./main/"),
  );

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
  await fs.promises.writeFile(dist, JSON.stringify(content, null, 2), "utf-8");
}
