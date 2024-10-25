import { watch, RollupBuild, RollupWatcher } from "rollup";
import process from "node:process";
import { getDevRollupOptions } from "@scripts/RollupUtils";

void dev().then(
  () => {
    console.log(`[dev] started up`);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function dev() {
  await import("./clean");
  const options = await getDevRollupOptions();
  try {
    const watcher: RollupWatcher = watch(options);
    watcher.on("event", async (event) => {
      if (event.code === "START") {
        console.log("recompiling...");
      } else if (event.code === "BUNDLE_END") {
        const bundle = event.result;
        // const outputs = Array.isArray(options.output)
        //   ? options.output
        //   : [options.output];
        // for (const outputOptions of outputs) {
        //   await rollupWrite(bundle, outputOptions);
        // }
        await bundle.close();
      } else if (event.code === "ERROR") {
        console.error("recompile error:", event.error);
      } else if (event.code === "END") {
        console.log("recompile done");
      }
    });
  } finally {
    // if (rollupBuild) {
    //   await rollupBuild.close();
    // }
  }
}

async function rollupWrite(bundle: RollupBuild, outputOptions) {
  const { output } = await bundle.write(outputOptions);
  // const { output } = await bundle.generate(outputOptions);
  for (const chunkOrAsset of output) {
    if (chunkOrAsset.type === "asset") {
      // console.log(`Asset:`, chunkOrAsset.fileName);
    } else {
      // console.log(
      //   `Chunk:`,
      //   chunkOrAsset.fileName,
      //   // Object.keys(chunkOrAsset.modules),
      // );
    }
  }
}
