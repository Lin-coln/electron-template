import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getTsupNoExternal } from "@scripts/utils/getTsupNoExternal";
import fs from "fs";
import { resolveAppConfig } from "@appConfig";
import { DIST, INPUT_MAIN, OUTPUT_MAIN } from "@scripts/utils/constant";

void main();
async function main() {
  console.log(`[build:main] compiling`);
  await build({
    entry: {
      index: path.resolve(projectDirname, INPUT_MAIN),
    },
    outDir: path.resolve(projectDirname, OUTPUT_MAIN),
    tsconfig: path.resolve(
      projectDirname,
      path.dirname(INPUT_MAIN),
      "./tsconfig.json",
    ),
    dts: false,
    format: ["esm"],
    target: "esnext",
    minify: false,
    clean: true,
    // splitting: false,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: getTsupNoExternal(),
    // // watch config
    // watch: [],
    // ignoreWatch: [],
  });

  // generate package.json
  const appCfg = await resolveAppConfig();
  await fs.promises.writeFile(
    path.resolve(projectDirname, DIST, "./package.json"),
    JSON.stringify(
      {
        name: appCfg.app_name,
        author: appCfg.author,
        version: appCfg.version,
        private: true,
        type: "module",
        main: path.relative(DIST, OUTPUT_MAIN),
        homepage: "./",
      },
      null,
      2,
    ),
    "utf8",
  );
}
