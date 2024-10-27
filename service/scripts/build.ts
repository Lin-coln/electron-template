import {
  build,
  getExternal,
  getPlugins,
  manualChunks,
} from "@scripts/RollupUtils";
import process from "node:process";
import { RollupOptions } from "rollup";
import path from "node:path";
import { getPackageJson, projectDirname } from "./utils";

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
  console.log(`[build] clean`);
  await import("./clean");

  console.log(`[build] compiling...`);
  const options = await getBuildRollupOptions();
  await build(options);

  console.log(`[build:electron] compiling...`);
  const electronOptions = await getElectronRollupOptions();
  await build(electronOptions);

  console.log(`[build] done`);
}

async function getBuildRollupOptions(): Promise<RollupOptions> {
  const external = await getExternal();
  return {
    input: path.resolve(projectDirname, "./src/index.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist"),
        entryFileNames: "[name].js",
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
      {
        dir: path.resolve(projectDirname, "./dist"),
        entryFileNames: "[name].cjs",
        format: "cjs",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins(),
  };
}

async function getElectronRollupOptions(): Promise<RollupOptions> {
  const pkg = await getPackageJson();
  const external = await getExternal([pkg.name]);
  return {
    input: path.resolve(projectDirname, "./src/electron/index.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist/electron"),
        entryFileNames: "[name].js",
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
      {
        dir: path.resolve(projectDirname, "./dist/electron"),
        entryFileNames: "[name].cjs",
        format: "cjs",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins({
      tsconfig: path.resolve(projectDirname, "./src/electron/tsconfig.json"),
    }),
  };
}
