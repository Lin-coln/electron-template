import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getNoExternal } from "@scripts/tsup/getNoExternal";

void main();
async function main() {
  console.log(`[build:main] compiling`);
  await build({
    entry: {
      index: path.resolve(projectDirname, "./src/main.ts"),
    },
    outDir: path.resolve(projectDirname, "./dist/main"),
    tsconfig: path.resolve(projectDirname, "./src/tsconfig.json"),
    dts: false,
    format: ["esm"],
    target: "esnext",
    minify: false,
    clean: true,
    // splitting: false,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: getNoExternal(),
    // // watch config
    // watch: [],
    // ignoreWatch: [],
  });
}
