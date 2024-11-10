import child_process from "node:child_process";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";
import { config } from "@scripts/utils/config";

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
    cwd: path.resolve(config.base, config.dist.build),
    env: {
      ...process.env,
      ...env,
    },
  });
}
