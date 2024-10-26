import {
  OutputAsset,
  OutputChunk,
  OutputOptions,
  rollup,
  RollupBuild,
  RollupOptions,
} from "rollup";
import path from "node:path";
import process from "node:process";
import { getBuildRollupOptions } from "@scripts/RollupUtils";
import { projectDirname } from "@scripts/utils";

void main().then(
  () => {
    process.exit(0);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function main() {
  await import("./clean");
  const optionsList = await getBuildRollupOptions();

  for (const options of optionsList) {
    await build(options);
  }

  console.log(`[build] build success`);
}

async function build(options: RollupOptions) {
  let rollupBuild: RollupBuild;
  try {
    rollupBuild = await rollup(options);
    const outputOptions: OutputOptions[] = Array.isArray(options.output)
      ? options.output
      : [options.output];
    for (const options: OutputOptions of outputOptions) {
      const { output } = await rollupBuild.write(options);
      for (const chunkOrAsset: OutputChunk | OutputAsset of output) {
        if (chunkOrAsset.type === "asset") {
          console.log(`- asset: ${chunkOrAsset.fileName}`);
        } else {
          Object.keys(chunkOrAsset.modules).map((filename) => {
            console.log(`- chunk:`, path.relative(projectDirname, filename));
          });
        }
      }
    }
  } finally {
    if (rollupBuild) {
      await rollupBuild.close();
    }
  }
}
