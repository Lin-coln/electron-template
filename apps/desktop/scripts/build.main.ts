import { RollupOptions } from "rollup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { getPlugins } from "@scripts/rollup/getPlugins";
import { getExternal } from "@scripts/rollup/getExternal";
import { createManualChunks } from "@scripts/rollup/createManualChunks";
import { build } from "@scripts/rollup";

void main();
async function main() {
  console.log(`[build:main] compiling`);
  const options = await getBuildRollupOptions();
  await build(options);
}

async function getBuildRollupOptions(): Promise<RollupOptions> {
  const external = await getExternal();
  const manualChunks = await createManualChunks();
  return {
    input: path.resolve(projectDirname, "./src/main.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist"),
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins({
      tsconfig: path.resolve(projectDirname, "./src/tsconfig.json"),
    }),
  };
}
