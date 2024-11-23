import process from "node:process";
import { ts } from "@tools/api";
import { context } from "@scripts/utils/config";

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
  await context.cleanup();
  await ts("build/main");
  await ts("build/preload");
  await ts("build/renderer");
  await context.generatePackageJson();
  console.log(`[build] done`);
}
