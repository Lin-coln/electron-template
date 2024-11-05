import process from "node:process";
import { ts } from "@tools/api";
import child_process from "node:child_process";
import path from "node:path";
import { projectDirname } from "@scripts/utils";

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
  await ts("clean");
  await ts("build.main");
  await ts("build.preload");
  await start();
}

async function start() {
  const env = {};
  const args = {
    INDEX_URL: `http://localhost:5173`,
  };
  const args_str = Object.entries(args)
    .map(([key, value]) => `--${key}=${value}`)
    .join(" ");
  child_process.execSync(`electron . ${args_str}`, {
    stdio: "inherit",
    cwd: path.resolve(projectDirname, "."),
    env: {
      ...process.env,
      ...env,
    },
  });
}
