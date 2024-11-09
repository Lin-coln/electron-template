import path from "node:path";
import { projectDirname } from "@scripts/utils";
import child_process, { ChildProcess } from "node:child_process";
import { build } from "tsup";
import { DIST, INPUT_MAIN, OUTPUT_MAIN } from "@scripts/utils/constant";
import { getTsupNoExternal } from "@scripts/utils/getTsupNoExternal";
import { ts, useCleanup } from "@tools/api";
import { createRequire } from "node:module";
import { generatePackageJson } from "@scripts/utils/generatePackageJson";

void main();
async function main() {
  await ts("clean");
  await generatePackageJson();
  await ts("build/preload");
  const renderer = await devRenderer();
  await devMain();
}

async function devRenderer() {
  const cwd = path.resolve(projectDirname, "../view");
  const cmd = `pnpm run dev`;
  const [command, ...args] = cmd.split(" ");
  const rendererProcess = child_process.spawn(command, args, {
    // stdio: "inherit",
    cwd: cwd,
  });
  rendererProcess.on("exit", () => process.exit());
  useCleanup(() => rendererProcess.killed || rendererProcess.kill(0));
  return rendererProcess;
}

async function devMain() {
  await build({
    entry: {
      index: path.resolve(projectDirname, INPUT_MAIN),
    },
    outDir: path.resolve(projectDirname, OUTPUT_MAIN),
    tsconfig: path.resolve(
      projectDirname,
      path.dirname(INPUT_MAIN),
      "./tsconfig.json",
    ),
    dts: false,
    format: ["esm"],
    target: "esnext",
    minify: false,
    clean: true,
    // splitting: false,
    splitting: true,
    sourcemap: true,
    skipNodeModulesBundle: true,
    noExternal: getTsupNoExternal(),

    // // watch config
    watch: true,
    // ignoreWatch: [],
    esbuildPlugins: [await restartElectronPlugin()],
  });
}

async function restartElectronPlugin() {
  let count = 0;
  const manager = createElectronProcessManager();

  return {
    name: "restart-electron-plugin",
    setup: async (build) => {
      build.onStart(() => {
        console.clear();
        console.log(`[electron] compiling...`, `(x ${count++})`);
      });
      build.onEnd(async (res) => {
        console.log(`[electron] compiled`, `(x ${count})`);
        if (!checkReboot(res)) return;
        console.log(`[electron] reboot...`, `(x ${count})`);
        await manager.reboot();
      });
    },
  };

  function checkReboot(res) {
    if (res.errors.length) {
      console.error(
        `There were [${res.errors.length}] build errors that are ` +
          "preventing start up.",
      );
      return false;
    }
    if (res.warnings.length) {
      console.warn(
        `There are [${res.warnings.length}] build warnings that are ` +
          "preventing start up. If you do not want to prevent start up " +
          'remove the "stopOnWarning" flag.',
      );
    }
    return true;
  }
}

function createElectronProcessManager() {
  let appProcess: ChildProcess;
  let isReboot = false;
  return {
    kill,
    reboot: debounce(reboot, 1000),
  };

  async function kill() {
    await new Promise<void>((resolve) => {
      appProcess.removeAllListeners();
      appProcess.once("exit", () => {
        resolve();
        appProcess = null as any;
      });
      appProcess.kill("SIGINT");
    });
  }

  async function reboot() {
    if (isReboot) return;
    isReboot = true;
    if (appProcess) {
      await kill();
    }

    console.log(`[electron] reboot app...`);
    appProcess = await spawnAppProcess({
      index_url: `http://localhost:5173`,
      no_focus: true,
    });
    appProcess.on("exit", () => {
      if (isReboot) return;
      console.log(`[electron] exit app`);
      process.exit(0);
    });
    isReboot = false;
  }

  async function spawnAppProcess(
    args: Record<string, string | number | boolean | undefined>,
  ) {
    const argsList = Object.entries(args)
      .filter((entry) => entry[1] !== undefined)
      .map(([key, value]) => `--${key}=${value}`);

    const electron = createRequire(import.meta.url)("electron");
    const appProcess = child_process.spawn(electron, [".", ...argsList], {
      // stdio: "inherit",
      cwd: path.resolve(projectDirname, DIST),
    });

    useCleanup(() => appProcess.kill(0));
    return appProcess;
  }
}

function debounce<Fn extends (...args: any[]) => void>(
  fn: Fn,
  time: number,
): Fn {
  let timer: any = null;
  const res = (...args: any[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer && clearTimeout(timer);
      fn(...args);
    }, time);
  };
  return res as any;
}
