import { Config, OriginConfig, RelativePath } from "./interface";
import fs from "fs";
import path from "node:path";

const isRelativePath = (x: unknown): x is RelativePath =>
  typeof x === "string" && x.startsWith("./");

export function defineConfig<
  Preloads extends string[],
  Renderers extends string[],
>(config: Config<Preloads, Renderers>): OriginConfig<Preloads, Renderers> {
  const result = {} as OriginConfig<Preloads, Renderers>;
  const projectDirname = resolveProjectDirname();

  // config.base
  result.base = config.base ?? projectDirname;
  if (!result.base) {
    throw new Error("failed to resolve config.base");
  }

  // config.dist
  result.dist = config.dist ?? {
    build: "./dist",
    pack: "./dist-pack",
  };

  // config.main
  // todo: use pipe to resolve config
  if (isRelativePath(config.main)) {
    result.main = {
      input: config.main,
      output: "./main",
    };
  } else {
    result.main = {
      input: "./src/main.ts",
      output: "./main",
      ...(config.main ?? {}),
    };
  }

  // config.preload
  result.preload = resolveConfigPreload(config.preload);

  // config.renderer
  result.renderer = resolveConfigRenderer(config.renderer);

  // config.resources
  result.resources = resolveConfigResources(config.resources, result);

  return result;
}

function resolveConfigPreload<Preloads extends any[], Renderers extends any[]>(
  configPreload: Config<Preloads, Renderers>["preload"],
): OriginConfig<Preloads, Renderers>["preload"] {
  let result: any = configPreload;

  if (!result) {
    result = {};
  }

  if (isRelativePath(result)) {
    result = { input: result };
  }
  if ("input" in result || "output" in result) {
    result = { main: { ...result } };
  }
  result = Object.fromEntries(
    Object.entries<object>(result).map(([name, preload]) => [
      name,
      {
        input: "./src/preload/index.ts",
        output: "./preload",
        ...preload,
      },
    ]),
  );
  return result;
}

function resolveConfigRenderer<Preloads extends any[], Renderers extends any[]>(
  configRenderer: Config<Preloads, Renderers>["renderer"],
): OriginConfig<Preloads, Renderers>["renderer"] {
  let result: any = configRenderer;

  if (!result) {
    result = {};
  }

  if (isRelativePath(result)) {
    result = { output: result };
  }
  if ("output" in result) {
    result = { main: { ...result } };
  }
  result = Object.fromEntries(
    Object.entries<object>(result).map(([name, preload]) => [
      name,
      {
        // not def
        ...preload,
      },
    ]),
  );
  return result;
}

function resolveConfigResources<
  Preloads extends any[],
  Renderers extends any[],
>(
  resources: Config<Preloads, Renderers>["resources"],
  ctx: OriginConfig<Preloads, Renderers>,
): OriginConfig<Preloads, Renderers>["resources"] {
  let result: any = resources;

  if (!result) {
    result = "./resources";
  }

  if (isRelativePath(result)) {
    const resources: OriginConfig<any, any>["resources"] = {
      internal: [],
      external: [],
    };
    const resourcesPath = path.resolve(ctx.base, result);
    const files = fs.readdirSync(resourcesPath);
    files.forEach((file) => {
      const filename = path.relative(
        ctx.base,
        path.resolve(resourcesPath, file),
      ) as RelativePath;
      const isExternal = file.startsWith(`.`);

      if (isExternal) {
        resources.external.push(filename);
      } else {
        resources.internal.push(filename);
      }
    });
    result = resources;
  }

  result = {
    internal: [
      // ...
      ...result.internal,
    ],
    external: [
      // ...
      ...result.internal,
    ],
  };

  return result;
}

function resolveProjectDirname() {
  let dirname = process.cwd();
  while (true) {
    if (fs.existsSync(path.resolve(dirname, "package.json"))) {
      return dirname;
    }
    dirname = path.resolve(dirname, "..");
  }
}
