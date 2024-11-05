import { OutputOptions, rollup, RollupBuild, RollupOptions } from "rollup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";

export async function build(options: RollupOptions) {
  let rollupBuild: RollupBuild | undefined = undefined;
  try {
    rollupBuild = await rollup(options);
    const outputOptions: OutputOptions[] = !options.output
      ? []
      : Array.isArray(options.output)
        ? options.output
        : [options.output];
    for (const options of outputOptions) {
      const { output } = await rollupBuild.write(options);
      for (const chunkOrAsset of output) {
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
