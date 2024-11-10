import * as child_process from "node:child_process";
import { projectDirname } from "@scripts/utils";
import path from "node:path";
import { config } from "@scripts/utils/config";

void main();

async function main() {
  const dist = path.resolve(
    config.base,
    config.dist.build,
    config.renderer.main.output,
  );
  const cwd = path.resolve(projectDirname, "../view");
  const env = {
    VITE_CONFIG_BASE: "./",
    VITE_CONFIG_DIST: dist,
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
