import process from "node:process";
import { ts } from "@tools/api";
import { context } from "@scripts/utils/config";
import { build } from "tsup";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import child_process from "node:child_process";

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
  console.log(`[build] start`);
  await context.cleanup();

  console.log(`[build:main] compiling`);
  await build(context.createMainTsupOptions());

  console.log(`[build:preload] compiling`);
  await build(context.createPreloadTsupOptions());

  await buildRenderer();
  await context.generatePackageJson();
  console.log(`[build] done`);
}

async function buildRenderer() {
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
