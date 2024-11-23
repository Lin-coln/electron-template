import { ChildProcess } from "node:child_process";
import { build } from "tsup";
import { ts, useCleanup } from "@tools/api";
import { context } from "@scripts/utils/config";

void main();
async function main() {
  await context.cleanup();
  await context.generatePackageJson();
  void ts("build/preload", { WATCH_PRELOAD: true });
  // const renderer = await devRenderer();
  await devMain();
}

async function devMain() {
  const opts = context.createMainTsupOptions();
  await build({
    ...opts,
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
    appProcess = await context.spawnElectronProcess({
      index_url: `http://localhost:5173`,
      no_focus: true,
    });
    useCleanup(() => appProcess.kill(0));
    appProcess.on("exit", () => {
      if (isReboot) return;
      console.log(`[electron] exit app`);
      process.exit(0);
    });
    isReboot = false;
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
