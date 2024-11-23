import { createRequire } from "node:module";
import child_process from "node:child_process";
import { Context } from "../Context";

export async function spawnElectronProcess(
  this: Context,
  args: Record<string, string | number | boolean | undefined>,
) {
  const argsList = Object.entries(args)
    .filter((entry) => entry[1] !== undefined)
    .map(([key, value]) => `--${key}=${value}`);
  const electron = createRequire(this.resolveFilename("."))("electron");
  const appProcess = child_process.spawn(electron, [".", ...argsList], {
    stdio: "inherit",
    cwd: this.resolveBuildFilename(),
  });

  return appProcess;
}
