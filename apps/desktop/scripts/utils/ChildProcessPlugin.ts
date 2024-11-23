import { ChildProcess } from "node:child_process";
import { useCleanup } from "@tools/api";
import { debounce } from "@scripts/utils/index";

class ChildProcessManager {
  process: ChildProcess | null;
  rebooting: boolean;
  onSpawnProcess: (reboot: boolean) => Promise<ChildProcess>;
  onExitProcess: () => void;
  constructor(opts: {
    onSpawnProcess: (reboot: boolean) => Promise<ChildProcess>;
    onExitProcess: () => void;
  }) {
    this.process = null;
    this.rebooting = false;
    this.onSpawnProcess = opts.onSpawnProcess;
    this.onExitProcess = opts.onExitProcess;
  }

  async kill() {
    await new Promise<void>((resolve) => {
      if (!this.process) return;
      this.process.removeAllListeners();
      this.process.once("exit", () => {
        resolve();
        this.process = null;
      });
      this.process.kill("SIGINT");
    });
  }

  async reboot() {
    if (this.rebooting) return;
    this.rebooting = true;
    if (this.process) {
      await this.kill();
    }

    this.process = await this.onSpawnProcess(this.process !== null);
    useCleanup(() => this.process?.kill(0));
    this.process.on("exit", () => {
      if (this.rebooting) return;
      this.onExitProcess();
    });
    this.rebooting = false;
  }
}

export function ChildProcessPlugin(opts: {
  name: string;
  onSpawnProcess: (reboot: boolean) => Promise<ChildProcess>;
}) {
  let count = 0;
  const logger = {
    log: (...args: any[]) => console.log(`[${opts.name}]`, ...args),
    warn: (...args: any[]) => console.warn(...args),
    error: (...args: any[]) => console.error(...args),
    clear: () => console.clear(),
  };
  const manager = new ChildProcessManager({
    async onSpawnProcess(reboot) {
      logger.log(`${reboot ? "reboot" : "start"}...`);
      return await opts.onSpawnProcess(reboot);
    },
    onExitProcess() {
      logger.log(`exit`);
      process.exit(0);
    },
  });

  const reboot = debounce(async () => {
    logger.log(`reboot...`, `(x ${count})`);
    await manager.reboot();
  }, 500);

  return {
    name: "child-process-plugin",
    setup: async (build) => {
      build.onStart(() => {
        logger.clear();
        logger.log(`compiling...`, `(x ${count++})`);
      });
      build.onEnd(async (res) => {
        logger.log(`compiled`, `(x ${count})`);
        if (!checkReboot(res)) return;
        await reboot();
      });
    },
  };

  function checkReboot(res) {
    if (res.errors.length) {
      logger.error(
        `There were [${res.errors.length}] build errors that are ` +
          "preventing start up.",
      );
      return false;
    }
    if (res.warnings.length) {
      logger.warn(
        `There are [${res.warnings.length}] build warnings that are ` +
          "preventing start up. If you do not want to prevent start up " +
          'remove the "stopOnWarning" flag.',
      );
    }
    return true;
  }
}
