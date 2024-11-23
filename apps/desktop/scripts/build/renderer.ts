import * as child_process from "node:child_process";
import { projectDirname } from "@scripts/utils";
import path from "node:path";
import { context } from "@scripts/utils/config";

void main();

async function main() {
  const cwd = path.resolve(projectDirname, "../view");
  const env = {
    VITE_CONFIG_BASE: "./",
    VITE_CONFIG_DIST: context.resolveBuildFilename("./renderer"),
  };
  child_process.execSync(`pnpm run build --emptyOutDir`, {
    stdio: "inherit",
    cwd: cwd,
    env: {
      ...process.env,
      ...env,
    },
  });
}
