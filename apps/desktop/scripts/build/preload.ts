import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getNoExternal } from "@scripts/tsup/getNoExternal";
import { INPUT_PRELOAD, OUTPUT_PRELOAD } from "@scripts/utils/constant";

void main();
async function main() {
  console.log(`[build:preload] compiling`);
  await build({
    entry: [path.resolve(projectDirname, INPUT_PRELOAD, "./index.ts")],
    outDir: path.resolve(projectDirname, OUTPUT_PRELOAD),
    tsconfig: path.resolve(projectDirname, INPUT_PRELOAD, "./tsconfig.json"),
    dts: false,
    format: ["cjs"],
    target: "es2023",
    minify: false,
    clean: true,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: getNoExternal(),
  });
}
