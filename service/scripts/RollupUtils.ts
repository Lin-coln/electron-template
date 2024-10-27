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

export function getPlugins({ tsconfig }: any = {}) {
  return [
    nodeResolve({
      extensions: [".js", ".ts"],
    }),
    commonjs(),
    typescript({
      tsconfig,
    }),
    // terser(),
    // visualizer({
    //   filename: "./dist/stats.html",
    // }),
  ];
}

export async function getExternal(externals: string[] = []): Promise<string[]> {
  const pkg = await getPackageJson();
  return Array.from<string>(
    new Set([
      "electron",
      ...externals,
      ...Object.keys(pkg.devDependencies ?? []),
      ...Object.keys(pkg.peerDependencies ?? []),
    ]),
  );
}

export function manualChunks(id) {
  const key = "/node_modules/";
  const idx = id.lastIndexOf(key);
  if (idx >= 0) {
    const name = id.slice(idx + key.length).split("/")[0];
    return `chunks/${name}`;
  }
}
