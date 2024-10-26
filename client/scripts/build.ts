import process from "node:process";
import { build, getBuildRollupOptions } from "@scripts/RollupUtils";

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
  console.log(`[build] clean`);
  await import("./clean");
  const options = await getBuildRollupOptions();
  console.log(`[build] compile preload`);
  await build(options.preload);
  console.log(`[build] compile main`);
  await build(options.main);
  console.log(`[build] done`);
}
