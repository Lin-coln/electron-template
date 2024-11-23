import { Options } from "electron-packager";
import { Config, RelativePath } from "./interface";
import { getBuildDirname, getPackDirname } from "./utils";
import path from "path";
import fs from "fs";

interface PackageConfig {
  app_name: string;
  product_name: string;
  author: string;
  version: string;
  icon: string; // icon absolute path
  arch: "arm64";
  platform: "darwin";
  description: string;
  copyright: string;
  protocols?: string[];
  // ....
  extra_resource?: string[];
  input: string;
  output: string;
}

export async function createPackOptions(cfg: Config): Promise<Options> {
  const extra_resources = await resolveExtraResources(cfg);

  const packOptions = createPackageOptions({
    // cfg.app
    app_name: cfg.app.name,
    product_name: cfg.app.product_name,
    author: cfg.app.author,
    version: cfg.app.version,
    description: cfg.app.description,
    copyright: cfg.app.copyright,

    // others
    icon: cfg.app.icon,
    input: getBuildDirname(cfg),
    output: getPackDirname(cfg),
    extra_resource: extra_resources,

    // todo
    arch: "arm64",
    platform: "darwin",
    protocols: [],
  });

  return packOptions;
}

function createPackageOptions(cfg: PackageConfig): Options {
  return Object.assign(
    {},
    getBuildOptions(),
    getGeneralOptions(),
    getWinOptions(),
    getMacOptions(),
    getHooksOptions(),
  );

  function getBuildOptions(): Options {
    return {
      // tmpdir: tmpdir,
      dir: cfg.input, // source dir
      out: cfg.output, // The base directory where the finished package(s) are created.
      arch: cfg.arch, // ia32 x64 armv7l arm64 mips64el universal
      platform: cfg.platform, // all, linux, win32, darwin, mas
      asar: true, // boolean | object
      overwrite: true, // Whether to replace an already existing output directory for a given platform (true) or skip recreating it (false).
      derefSymlinks: true, // dereference symlinks when copying app source
      extraResource: cfg.extra_resource, // exposed resources
      prune: true, // remove all devDependencies
      quiet: false, // disable printing console messages
    };
  }

  function getGeneralOptions(): Partial<Options> {
    return {
      icon: cfg.icon,
      // appBundleId: 'string',
      appCopyright: cfg.copyright,
      appVersion: cfg.version,
      buildVersion: cfg.version,
      name: cfg.app_name,
      executableName: cfg.product_name, // cfg.app_name,
      // prebuiltAsar: string, // the path to a prebuilt asar file
      // ignore: (pathname) => boolean,
      // junk: boolean,
      // osxUniversal: {},
      // download: {
      //   mirrorOptions: {
      //     mirror: `https://npm.taobao.org/mirrors/electron/`,
      //   },
      // },
      // electronVersion: string,
      // electronZipDir: string, // use local electron module instead of downloading it
    };
  }

  function getWinOptions(): Partial<Options> {
    return {
      // https://electron.github.io/electron-packager/main/interfaces/electronpackager.win32metadataoptions.html
      win32metadata: {
        CompanyName: cfg.author,
        FileDescription: cfg.description,
        InternalName: cfg.app_name,
        OriginalFilename: cfg.app_name,
        ProductName: cfg.product_name,
        // 'application-manifest': ,
        // 'requested-execution-level':,
      },
    };
  }

  // https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html#appcategorytype
  function getMacOptions(): Partial<Options> {
    return {
      // https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/LaunchServicesKeys.html#//apple_ref/doc/uid/TP40009250-SW8
      // appCategoryType: 'public.app-category.utilities',
      // darwinDarkModeSupport: true,
      // extendHelperInfo: string | {},
      // extendInfo: string | {},
      // helperBundleId: string,
      // osxNotarize: ,
      // osxSign: true | OsxSignOptions,
      // protocols: !cfg.protocols
      //   ? undefined
      //   : [{ name: cfg.product_name, schemes: cfg.protocols }],
      // usageDescription: {},
    };
  }

  function getHooksOptions(): Partial<Options> {
    return {
      // afterAsar,
      // afterComplete,
      // afterCopy,
      // afterCopyExtraResources,
      // afterExtract,
      // afterFinalizePackageTargets,
      // afterPrune,
      // beforeAsar,
      // beforeCopy,
      // beforeCopyExtraResources,
    };
  }
}

async function resolveExtraResources(cfg: Config) {
  const assets = cfg.assets
    .filter((asset) => asset.type === "extra")
    // todo filename extra
    .filter((asset) => "dirname" in asset);

  const filenames: string[] = [];
  for (const asset of assets) {
    const dirname = asset.source;
    const files = await fs.promises.readdir(path.resolve(cfg.base, dirname));
    filenames.push(
      ...files
        .filter((file) => asset.filter(file))
        .map((file) => path.join(dirname, file)),
    );
  }

  const dict = {};
  filenames.forEach((filename) => {
    const key = path.basename(filename);
    if (key in dict) {
      console.warn(`extra file was override: ${dict[key]}`);
    }
    dict[key] = filename;
  });

  return Array.from<string>(Object.values(dict)).map((filename) =>
    path.resolve(cfg.base, filename),
  );
}
