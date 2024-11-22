import { ElectronInstallerDMGOptions } from "electron-installer-dmg";
import path from "path";
import { Config } from "./interface";
import { getPackDirname } from "./utils";

export async function createDarwinInstallerOptions(
  cfg: Config,
): Promise<ElectronInstallerDMGOptions> {
  const platform = "darwin";
  const arch = "arm64";

  const packDir = getPackDirname(cfg);
  const unpackFolder = `${cfg.app.name}-${platform}-${arch}`;

  return {
    name: cfg.app.name,
    title: cfg.app.product_name,
    overwrite: true,
    // debug: true,
    appPath: path.resolve(packDir, unpackFolder, `${cfg.app.name}.app`),
    out: packDir,
    // background: '', // dmg window background image filename
    icon: path.resolve(cfg.base, cfg.app.icon),
    iconSize: 80,
    // contents: [
    //
    // ]
  };
}
