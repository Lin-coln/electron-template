import { Config } from "./interface";
import { projectDirname } from "@scripts/utils";

export const config: Config = {
  base: projectDirname,
  dist_build: "./dist",
  dist_pack: "./dist-pack",

  // app
  app: {
    name: "foobar",
    author: "lincoln",
    version: "0.0.1",
  },

  // assets
  assets: [
    {
      type: "main",
      filename: "@app/main/index.js",
      input: "./src/main.ts",
    },
    {
      type: "preload",
      filename: "@app/preload/index.cjs",
      input: "./src/preload/index.ts",
    },
    {
      type: "resource",
      filename: "@app/resources/*",
      source: `./src/resources/*`,
    },
    {
      type: "external",
      filename: "@ext/*",
      source: "./src/resources/.*",
    },
  ],

  // tsup options
  options: {
    main: {
      tsconfig: "./src/tsconfig.json",
      noExternal: [
        // libs
        "@lib/electron-utils",
        // ...["electron-devtools-installer"],
      ],
    },
    preload: {
      tsconfig: "./src/preload/tsconfig.json",
      noExternal: [
        // libs
        "@lib/electron-utils",
        // ...["electron-devtools-installer"],
      ],
    },
  },
};
