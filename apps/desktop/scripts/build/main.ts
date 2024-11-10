import { build } from "tsup";
import path from "node:path";
import { getTsupNoExternal } from "@scripts/utils/getTsupNoExternal";
import { isMainEntry } from "@tools/api";
import { config } from "@scripts/utils/config";

if (isMainEntry(import.meta)) {
  // ...
}

void main();
async function main() {
  const watch = (process.env.WATCH_MAIN ?? "false") === "true";

  console.log(`[build:main] compiling`);

  await build({
    entry: {
      index: path.resolve(config.base, config.main.input),
    },
    outDir: path.resolve(config.base, config.dist.build, config.main.output),
    tsconfig: path.resolve(
      config.base,
      path.dirname(config.main.input),
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
