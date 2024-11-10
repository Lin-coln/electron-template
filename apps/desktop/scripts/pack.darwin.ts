import pack, { Options } from "electron-packager";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { resolveAppConfig } from "@appConfig";
import fs from "fs";
import { config } from "@scripts/utils/config";

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

void main();
async function main() {
  console.log(`[pack] pack darwin application`);
  const appConfig = await resolveAppConfig();

  // copy internal resources
  console.log(`[pack] cp internal resources`);
  await copyInternalResource();

  // pack
  console.log(`[pack] start packing...`);
  const externalDirname = path.resolve(projectDirname, "./resources");
  const extra_resource = await fs.promises
    .readdir(externalDirname)
    .then((files) =>
      files
        .filter((file) => file.startsWith("."))
        .map((file) => path.resolve(externalDirname, file)),
    );

  const cfg: PackageConfig = {
    ...appConfig,
    arch: "arm64",
    platform: "darwin",
    icon: path.resolve(projectDirname, "./resources/icons/icon.icns"),
    input: path.resolve(config.base, config.dist.build),
    output: path.resolve(config.base, config.dist.pack),
    extra_resource: extra_resource,
  };

  const options = createPackageOptions(cfg);
  await pack(options);
  console.log(`[pack] darwin application packed`);
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
      protocols: !cfg.protocols
        ? undefined
        : [{ name: cfg.product_name, schemes: cfg.protocols }],
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

async function copyInternalResource() {
  const sourceDirname = path.resolve(projectDirname, "./resources");
  const targetDirname = path.resolve(projectDirname, "./dist");

  const files = await fs.promises.readdir(sourceDirname);
  for (const file of files) {
    if (file.startsWith(".")) continue;

    if (fs.existsSync(path.resolve(targetDirname, file))) {
      throw new Error(
        `failed to copy file, conflict name with compiled file: ${file}`,
      );
    }

    await fs.promises.cp(
      path.resolve(sourceDirname, file),
      path.resolve(targetDirname, file),
      {
        recursive: true,
      },
    );
  }
}
