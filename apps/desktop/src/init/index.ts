import { installChromeExtensions } from "@lib/electron-utils";
import { isDevelopment, isTest } from "@src/utils";

export async function initElectron() {
  if ([isDevelopment, isTest].some(Boolean)) {
    await installChromeExtensions(["REACT_DEVELOPER_TOOLS"]);
  }
}

export async function initService() {
  const services = await import("../services").then((mod) => mod.default);
  await services.initialize();
  console.log(`service started`);
}
