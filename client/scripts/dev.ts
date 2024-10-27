import process from "node:process";
import { ts } from "@tools/api";

void main().then(
  () => {
    console.log(`[dev] started up`);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function main() {
  await ts("clean");
  await ts("build.preload");
  await ts("dev.main");
}
