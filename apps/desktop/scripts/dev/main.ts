import { build } from "tsup";
import { context } from "@scripts/utils/config";
import { ChildProcessPlugin } from "../utils/ChildProcessPlugin";

void main();
async function main() {
  await context.cleanup();
  await context.generatePackageJson();
  void build({ ...context.createPreloadTsupOptions(), watch: true });

  // const renderer = await devRenderer();
  await devMain();
}

async function devMain() {
  const opts = context.createMainTsupOptions();

  const childProcessPlugin = ChildProcessPlugin({
    name: "electron",
    onSpawnProcess: () =>
      context.spawnElectronProcess({
        index_url: `http://localhost:5173`,
        no_focus: true,
      }),
  });

  await build({
    ...opts,
    // // watch config
    watch: true,
    // ignoreWatch: [],
    esbuildPlugins: [childProcessPlugin],
  });
}
