export type BuildOption = {
  input: RelativePath;
  output: RelativePath;
};

export type RendererOption = {
  output: RelativePath;
};

export type RelativePath = `./${string}`;

export interface OriginConfig<
  Preloads extends string[],
  Renderers extends string[],
> {
  base: string;
  dist: {
    build: RelativePath;
    pack: RelativePath;
  };
  main: BuildOption;
  preload: Record<Preloads[number], BuildOption>;
  renderer: Record<Renderers[number], RendererOption>;
  resources: {
    internal: RelativePath[];
    external: RelativePath[];
  };
}

export interface Config<Preloads extends string[], Renderers extends string[]> {
  base?: string;
  dist?: OriginConfig<Preloads, Renderers>["dist"];
  main?: RelativePath | Partial<BuildOption>;
  preload?:
    | RelativePath
    | Partial<BuildOption>
    | Record<Preloads[number], Partial<BuildOption>>;
  renderer?:
    | RelativePath
    | Partial<RendererOption>
    | Record<Renderers[number], Partial<RendererOption>>;
  resources?:
    | RelativePath
    | {
        internal: RelativePath[];
        external: RelativePath[];
      };
}
