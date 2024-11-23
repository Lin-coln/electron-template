import { ElectronInstallerDMGOptions } from "electron-installer-dmg";
import { Config } from "./interface";
import { Context } from "./Context";

export async function createDarwinInstallerOptions(
  cfg: Config,
): Promise<ElectronInstallerDMGOptions> {
  const ctx = new Context(cfg);

  const platform = "darwin";
  const arch = "arm64";

  const unpackFolder = `${cfg.app.name}-${platform}-${arch}`;

  return {
    name: cfg.app.name,
    title: cfg.app.product_name,
    overwrite: true,
    // debug: true,
    appPath: ctx.resolvePackFilename(unpackFolder, `${cfg.app.name}.app`),
    out: ctx.resolvePackFilename(),
    // background: '', // dmg window background image filename
    icon: ctx.resolveFilename(cfg.app.icon),
    iconSize: 80,
    // contents: [
    //
    // ]
  };
}
