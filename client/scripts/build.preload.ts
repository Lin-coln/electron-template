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
  console.log(`[build:preload] compiling`);
  const options = await getBuildRollupOptions();
  await build(options);
}

async function getBuildRollupOptions(): Promise<RollupOptions> {
  const external = await getExternal();
  const manualChunks = await createManualChunks();
  return {
    input: path.resolve(projectDirname, "./src/preload/index.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist/preload"),
        format: "commonjs",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins("preload"),
  };
}
