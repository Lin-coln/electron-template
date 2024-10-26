import {
  OutputAsset,
  OutputChunk,
  OutputOptions,
  rollup,
  RollupBuild,
  RollupOptions,
} from "rollup";
import path from "node:path";

// plugins
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
// import terser from "@rollup/plugin-terser";
// import { visualizer } from "rollup-plugin-visualizer";

// utils
import { getPackageJson, projectDirname } from "@scripts/utils";

export async function getBuildRollupOptions(): Promise<{
  preload: RollupOptions;
  main: RollupOptions;
}> {
  const external = await getExternal();
  const main: RollupOptions = {
    input: path.resolve(projectDirname, "./src/main.ts"),
    output: [
      {
        dir: path.resolve(projectDirname, "./dist"),
        format: "esm",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins(),
  };
  const preload: RollupOptions = {
    input: path.resolve(projectDirname, "./src/preload.ts"),
    output: [
      {
        file: path.resolve(projectDirname, "./dist/preload.js"),
        format: "commonjs",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins("preload"),
  };
  return { preload, main };
}

export async function getDevRollupOptions(): Promise<{
  preload: RollupOptions;
  main: RollupOptions;
}> {
  const external = await getExternal();
  const main: RollupOptions = {
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
  const preload: RollupOptions = {
    input: path.resolve(projectDirname, "./src/preload.ts"),
    output: [
      {
        file: path.resolve(projectDirname, "./dist/preload.js"),
        format: "commonjs",
        sourcemap: true,
        manualChunks,
      },
    ],
    external,
    plugins: getPlugins("preload"),
  };
  return { preload, main };
}

export async function build(options: RollupOptions) {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPlugins(type: "main" | "preload" = "main") {
  return [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    commonjs(),
    typescript(
      {
        main: {},
        preload: {
          tsconfig: path.resolve(projectDirname, "./src/tsconfig.preload.json"),
        },
      }[type] ?? {},
    ),
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
  if (idx >= 0) {
    const name = id.slice(idx + key.length).split("/")[0];
    return `chunks/${name}`;
  }
}
