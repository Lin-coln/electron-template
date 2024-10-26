import { watch, RollupBuild, RollupWatcher, RollupOptions } from "rollup";
import process from "node:process";
import { build, getDevRollupOptions } from "@scripts/RollupUtils";

void main().then(
  () => {
    console.log(`[dev] started up`);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function main() {
  console.log(`[dev] loading...`);
  await import("./clean");
  const options = await getDevRollupOptions();
  console.log(`[dev] compiling...`);
  await dev(options);
}

async function dev(options: RollupOptions) {
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
