import { build, getBuildRollupOptions } from "@scripts/RollupUtils";
import process from "node:process";

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
  console.log(`[build] compiling...`);
  await build(options);
  console.log(`[build] done`);
}
