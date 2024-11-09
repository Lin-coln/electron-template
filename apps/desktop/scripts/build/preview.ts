import child_process from "node:child_process";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import process from "node:process";
import { DIST } from "@scripts/utils/constant";
import { createRequire } from "node:module";

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
    cwd: path.resolve(projectDirname, DIST),
    env: {
      ...process.env,
      ...env,
    },
  });
}
