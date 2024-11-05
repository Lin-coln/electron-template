import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export function getPlugins({ tsconfig }) {
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
