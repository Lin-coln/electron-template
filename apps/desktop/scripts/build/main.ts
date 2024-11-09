import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getTsupNoExternal } from "@scripts/utils/getTsupNoExternal";
import { DIST, INPUT_MAIN, OUTPUT_MAIN } from "@scripts/utils/constant";
import { isMainEntry } from "@tools/api";

if (isMainEntry(import.meta)) {
  // ...
}

void main();
async function main() {
  const watch = (process.env.WATCH_MAIN ?? "false") === "true";

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
    watch: watch,
    // ignoreWatch: [],
  });
}
