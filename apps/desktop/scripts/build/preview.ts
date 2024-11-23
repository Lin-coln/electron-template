import process from "node:process";
import { config } from "@scripts/utils/config";
import { startupElectron } from "@scripts/utils/toolkit";

void main();
async function main() {
  await startupElectron(config, {
    INDEX_URL: process.env.INDEX_URL ?? undefined,
  });
}
