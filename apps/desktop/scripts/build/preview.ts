import child_process from "node:child_process";
import process from "node:process";
import { createRequire } from "node:module";
import { config } from "@scripts/utils/toolkit/config";
import { getBuildDirname } from "@scripts/utils/toolkit";

void main();
async function main() {
  const env = {};
  const args = {
    INDEX_URL: process.env.INDEX_URL ?? undefined,
  };
  const args_str = Object.entries(args)
    .filter((entry) => entry[1] !== undefined)
    .map(([key, value]) => `--${key}=${value}`)
    .join(" ");

  const electron = createRequire(import.meta.url)("electron");
  child_process.execSync(`${electron} . ${args_str}`, {
    stdio: "inherit",
    cwd: getBuildDirname(config),
    env: {
      ...process.env,
      ...env,
    },
  });
}
