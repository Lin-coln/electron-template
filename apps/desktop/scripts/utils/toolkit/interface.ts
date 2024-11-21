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
      type: "resource";
      filename: `@app/resources/${string}`;
      source: RelativePath;
    }
  | {
      type: "external";
      filename: `@ext/${string}`;
      source: RelativePath;
    };

export interface Config {
  base: string;
  dist_build: RelativePath;
  dist_pack: RelativePath;
  app: {
    name: string;
    author: string;
    version: string;
    // description:string;
    // copyright:string;
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
