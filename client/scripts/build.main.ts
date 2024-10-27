import {
  build,
  createManualChunks,
  getExternal,
  getPlugins,
} from "@scripts/RollupUtils";
import { RollupOptions } from "rollup";
import path from "node:path";
import { projectDirname } from "./utils";

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
    plugins: getPlugins(),
  };
}
