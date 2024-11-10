import { build } from "tsup";
import path from "node:path";
import { getTsupNoExternal } from "@scripts/utils/getTsupNoExternal";
import { config } from "@scripts/utils/config";

void main();
async function main() {
  const watch = (process.env.WATCH_PRELOAD ?? "false") === "true";

  console.log(`[build:preload] compiling`);

  await build({
    entry: [path.resolve(config.base, config.preload.main.input)],
    outDir: path.resolve(
      config.base,
      config.dist.build,
      config.preload.main.output,
    ),
    tsconfig: path.resolve(
      config.base,
      path.dirname(config.preload.main.input),
      "./tsconfig.json",
    ),
    dts: false,
    format: ["cjs"],
    target: "es2023",
    minify: false,
    clean: true,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: getTsupNoExternal(),
    //
    watch: watch,
  });
}
