import pack from "electron-packager";
import { config } from "@scripts/utils/config";
import { copyAsar, createPackOptions } from "@scripts/utils/toolkit";

void main();
async function main() {
  console.log(`[pack] pack darwin application`);

  console.log(`[pack] cp resources`);
  await copyAsar(config);

  console.log(`[pack] start packing...`);
  const options = await createPackOptions(config);
  await pack(options);
  console.log(`[pack] darwin application packed`);
}
