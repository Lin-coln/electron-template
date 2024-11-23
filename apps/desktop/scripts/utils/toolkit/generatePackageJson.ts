import { Config } from "./interface";
import path from "node:path";
import fs from "fs";
import { Context } from "./Context";

export async function generatePackageJson(cfg: Config) {
  const ctx = new Context(cfg);

  const app = cfg.app;
  const dist = ctx.resolveBuildFilename("./package.json");

  const entryAsset = cfg.assets
    .filter((asset) => asset.type === "main")
    .find((asset) => asset.filename === `@app/main/index.js`);
  if (!entryAsset) {
    throw new Error(`entry not found`);
  }

  const entryFilename = ctx.resolveBuildFilename(
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
