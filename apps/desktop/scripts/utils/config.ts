import { projectDirname } from "@scripts/utils/index";
import { Context, Config } from "@lib/electron-toolkit";

export const config: Config = {
  base: projectDirname,
  dist_build: "./dist",
  dist_pack: "./dist-pack",

  // app
  app: {
    name: "foobar",
    author: "lincoln",
    version: "0.0.1",
    product_name: "Foobar",
    description: "my description",
    copyright: "my copyright",
    // darwin icon
    icon: "./resources/icons/icon.icns",
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
      type: "asar",
      dirname: "@app/.",
      source: `./resources`,
      filter: (file) => !file.startsWith("."),
    },
    {
      type: "extra",
      dirname: "@ext/.",
      source: "./resources",
      filter: (file) => file.startsWith("."),
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

export const context = new Context(config);
