import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getNoExternal } from "@scripts/tsup/getNoExternal";

void main();
async function main() {
  console.log(`[build:preload] compiling`);
  await build({
    entry: [path.resolve(projectDirname, "./src/preload/index.ts")],
    outDir: path.resolve(projectDirname, "./dist/preload"),
    tsconfig: path.resolve(projectDirname, "./src/preload/tsconfig.json"),
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
