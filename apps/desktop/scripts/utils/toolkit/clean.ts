import fs from "fs";
import { Config } from "./interface";
import { Context } from "./Context";

export async function clean(cfg: Config) {
  const ctx = new Context(cfg);
  const targets = [
    // clean
    ctx.resolvePackFilename(),
    ctx.resolveBuildFilename(),
  ];
  await Promise.all(
    targets.map(async (dirname) => {
      if (!fs.existsSync(dirname)) return;
      await fs.promises.rm(dirname, {
        recursive: true,
      });
    }),
  );
}
