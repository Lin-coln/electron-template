import { RollupOptions } from "rollup";
import path from "node:path";

// plugins
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
// import terser from "@rollup/plugin-terser";
// import { visualizer } from "rollup-plugin-visualizer";

// utils
import { getPackageJson, projectDirname } from "@scripts/utils";

export async function getBuildRollupOptions(): Promise<RollupOptions> {
  return {
    input: [
      path.resolve(projectDirname, "./src/main.ts"),
      path.resolve(projectDirname, "./src/preload.js"),
    ],
    output: [
      {
        dir: path.resolve(projectDirname, "./dist"),
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
    ],
    external: await getExternal(),
    plugins: getPlugins(),
  };
}

export async function getDevRollupOptions(): Promise<RollupOptions> {
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
    external: await getExternal(),
    plugins: getPlugins(),
    watch: {
      clearScreen: true,
    },
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPlugins() {
  return [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    commonjs(),
    typescript({}),
    // terser(),
    // visualizer({
    //   filename: "./dist/stats.html",
    // }),
  ];
}

async function getExternal(): Promise<string[]> {
  const pkg = await getPackageJson();
  return Array.from<string>(
    new Set([
      "electron",
      ...Object.keys(pkg.devDependencies ?? []),
      ...Object.keys(pkg.peerDependencies ?? []),
    ]),
  );
}

function manualChunks(id) {
  const key = "/node_modules/";
  const idx = id.lastIndexOf(key);
  if (idx < 0) return;
  const name = id.slice(idx + key.length).split("/")[0];
  return `chunks/${name}`;
}
