import { createDMG } from "electron-installer-dmg";
import path from "path";
import { resolveAppConfig } from "@appConfig";
import { projectDirname } from "@scripts/utils";
import { DIST_PACK } from "@scripts/utils/constant";

void main();

async function main() {
  const appConfig = await resolveAppConfig();
  const cfg = {
    ...appConfig,
    platform: "darwin",
    arch: "arm64",
    output: path.resolve(projectDirname, DIST_PACK),
  };

  await createDMG({
    name: cfg.app_name,
    title: cfg.product_name,
    overwrite: true,
    // debug: true,
    appPath: path.resolve(
      cfg.output,
      `${cfg.app_name}-${cfg.platform}-${cfg.arch}`,
      `${cfg.app_name}.app`,
    ),
    out: cfg.output,
    // background: '', // dmg window background image filename
    icon: path.resolve(projectDirname, "./resources/icons/icon.icns"),
    iconSize: 80,
    // contents: [
    //
    // ]
  });
}
