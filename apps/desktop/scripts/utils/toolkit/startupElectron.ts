import { createRequire } from "node:module";
import child_process from "node:child_process";
import process from "node:process";
import { Config } from "./interface";
import { Context } from "./Context";

export async function startupElectron(
  cfg: Config,
  args: Record<string, string | undefined>,
): Promise<void> {
  const ctx = new Context(cfg);
  const electron = createRequire(ctx.resolveFilename("."))("electron");
  const env = {};
  const args_str = Object.entries(args)
    .filter((entry) => entry[1] !== undefined)
    .map(([key, value]) => `--${key}=${value}`)
    .join(" ");
  child_process.execSync(`${electron} . ${args_str}`, {
    stdio: "inherit",
    cwd: ctx.resolveBuildFilename(),
    env: {
      ...process.env,
      ...env,
    },
  });
}
