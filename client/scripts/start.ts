import * as child_process from "node:child_process";
import { projectDirname } from "@scripts/utils";
import path from "node:path";

void main();
async function main() {
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
