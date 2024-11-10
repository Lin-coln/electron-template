import { defineConfig } from "@lib/electron-toolkit";

export const config = defineConfig({
  dist: {
    build: "./dist",
    pack: "./dist-pack",
  },
  main: "./src/main.ts",
  preload: "./src/preload/index.ts",
  resources: "./resources",
  // ...
  renderer: "./renderer",
});
