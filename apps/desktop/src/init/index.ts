import { installChromeExtensions } from "@lib/electron-utils";
import { isDevelopment, isTest } from "@src/utils";
import { nativeTheme } from "electron";

export async function initElectron() {
  console.log(`[init] init electron...`);
  if ([isDevelopment, isTest].some(Boolean)) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }

  nativeTheme.themeSource = "system";
}

export async function initService() {
  const services = await import("../services").then((mod) => mod.default);
  await services.initialize();
  console.log(`service started`);
}
