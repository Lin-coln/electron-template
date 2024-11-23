import { Options } from "tsup";

export type RelativePath = `./${string}`;
export type Asset =
  | {
      type: "main";
      filename: `@app/main/${string}`;
      input: RelativePath;
    }
  | {
      type: "preload";
      filename: `@app/preload/${string}`;
      input: RelativePath;
    }
  | {
      type: "asar";
      filename: `@app/${string}`;
      source: RelativePath;
    }
  | {
      type: "extra";
      filename: `@ext/${string}`;
      source: RelativePath;
    }
  // dynamic
  | {
      type: "asar";
      dirname: `@app/${string}`;
      source: RelativePath;
      filter: (file: string) => boolean;
    }
  | {
      type: "extra";
      dirname: `@ext/${string}`;
      source: RelativePath;
      filter: (file: string) => boolean;
    };

export interface Config {
  base: string;
  dist_build: RelativePath;
  dist_pack: RelativePath;
  app: {
    name: string;
    author: string;
    version: string;
    product_name: string;
    description: string;
    copyright: string;

    // pack
    icon: RelativePath; // .icns
    // protocols
  };
  assets: Asset[];
  options: {
    main: {
      tsconfig: RelativePath;
      noExternal: Options["noExternal"];
    };
    preload: {
      tsconfig: RelativePath;
      noExternal: Options["noExternal"];
    };
  };
}
