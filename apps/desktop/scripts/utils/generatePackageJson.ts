import { resolveAppConfig } from "@appConfig";
import fs from "fs";
import path from "node:path";
import { projectDirname } from "@scripts/utils/index";
import { DIST, OUTPUT_MAIN } from "@scripts/utils/constant";

export async function generatePackageJson() {
  const appCfg = await resolveAppConfig();
  const dist = path.resolve(projectDirname, DIST, "./package.json");
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
        main: path.relative(DIST, path.join(OUTPUT_MAIN, "./index.js")),
        homepage: "./",
      },
      null,
      2,
    ),
    "utf8",
  );
}
