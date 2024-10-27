import { watch, RollupBuild, RollupWatcher, RollupOptions } from "rollup";
import process from "node:process";
import { build, getDevRollupOptions } from "@scripts/RollupUtils";
import { ts } from "@tools/api";
import path from "node:path";
import { createManualChunks, getExternal, getPlugins } from "./RollupUtils";
import { projectDirname } from "./utils";

void main();

async function main() {
  console.log(`[dev:main] loading...`);
  const external = await getExternal();
  const manualChunks = await createManualChunks();
  const options: RollupOptions = {
    input: path.resolve(projectDirname, "./src/main.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist"),
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
    ],
    watch: {
      clearScreen: true,
    },
    external,
    plugins: getPlugins(),
  };

  await dev(options);

  console.log(`[dev:main] started up`);
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
