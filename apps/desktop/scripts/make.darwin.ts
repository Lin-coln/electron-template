import { createDMG } from "electron-installer-dmg";
import { config } from "@scripts/utils/config";
import { createDarwinInstallerOptions } from "@scripts/utils/toolkit";

void main();

async function main() {
  console.log(`[make] make dmg installer...`);
  const options = await createDarwinInstallerOptions(config);
  await createDMG(options);
  console.log(`[make] done.`);
}
