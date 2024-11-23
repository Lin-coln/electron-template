import process from "node:process";
import { context } from "@scripts/utils/config";

void main();
async function main() {
  await context.spawnElectronProcess({
    INDEX_URL: process.env.INDEX_URL ?? undefined,
  });
}
