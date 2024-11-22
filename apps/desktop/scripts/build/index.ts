import process from "node:process";
import { ts } from "@tools/api";
import { generatePackageJson } from "@scripts/utils/toolkit";
import { config } from "@scripts/utils/config";

void main().then(
  () => {
    process.exit(0);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function main() {
  console.log(`[build] start`);
  await ts("clean");
  await ts("build/main");
  await ts("build/preload");
  await ts("build/renderer");
  await generatePackageJson(config);
  console.log(`[build] done`);
}
