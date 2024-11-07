import path from "node:path";

export const DIST = "./dist";
export const DIST_PACK = "./dist-pack";
export const INPUT_MAIN = "./src/main.ts";
export const INPUT_PRELOAD = "./src/preload";
export const OUTPUT_MAIN = path.join(DIST, "./main/index.ts");
export const OUTPUT_PRELOAD = path.join(DIST, "./preload");
export const OUTPUT_RENDERER = path.join(DIST, "./renderer");
