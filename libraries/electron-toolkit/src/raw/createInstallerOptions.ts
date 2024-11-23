import { ElectronInstallerDMGOptions } from "electron-installer-dmg";
import { Context } from "../Context";

export async function createDarwinInstallerOptions(
  this: Context,
): Promise<ElectronInstallerDMGOptions> {
  const cfg = this.config;

  const platform = "darwin";
  const arch = "arm64";

  const unpackFolder = `${cfg.app.name}-${platform}-${arch}`;

  return {
    name: cfg.app.name,
    title: cfg.app.product_name,
    overwrite: true,
    // debug: true,
    appPath: this.resolvePackFilename(unpackFolder, `${cfg.app.name}.app`),
    out: this.resolvePackFilename(),
    // background: '', // dmg window background image filename
    icon: this.resolveFilename(cfg.app.icon),
    iconSize: 80,
    // contents: [
    //
    // ]
  };
}
