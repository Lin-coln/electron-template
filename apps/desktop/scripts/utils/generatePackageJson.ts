import { resolveAppConfig } from "@appConfig";
import fs from "fs";
import path from "node:path";
import { config } from "@scripts/utils/config";

export async function generatePackageJson() {
  const appCfg = await resolveAppConfig();
  const dist = path.resolve(config.base, config.dist.build, "./package.json");
  if (!fs.existsSync(path.dirname(dist))) {
    await fs.promises.mkdir(path.dirname(dist), { recursive: true });
  }
  await fs.promises.writeFile(
    dist,
    JSON.stringify(
      {
        name: appCfg.app_name,
        author: appCfg.author,
        version: appCfg.version,
        private: true,
        type: "module",
        main: path.join(config.main.output, "./index.js"),
        homepage: "./",
      },
      null,
      2,
    ),
    "utf8",
  );
}
