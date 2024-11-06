import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";

void main();
async function main() {
  console.log(`[build:main] compiling`);
  await build({
    entry: [path.resolve(projectDirname, "./src/main.ts")],
    outDir: path.resolve(projectDirname, "./dist"),
    tsconfig: path.resolve(projectDirname, "./src/tsconfig.json"),
    dts: false,
    format: "esm",
    target: "esnext",
    minify: false,
    clean: true,
    splitting: false,
    sourcemap: true,
    skipNodeModulesBundle: true,
  });
}
