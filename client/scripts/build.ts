import {
  OutputAsset,
  OutputChunk,
  OutputOptions,
  rollup,
  RollupBuild,
} from "rollup";
import path from "node:path";
import { getBuildRollupOptions } from "./RollupUtils";
import process from "node:process";
import { projectDirname } from "./utils";

void build().then(
  () => {
    console.log(`[build] build success`);
    process.exit(0);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function build() {
  const options = await getBuildRollupOptions();
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
