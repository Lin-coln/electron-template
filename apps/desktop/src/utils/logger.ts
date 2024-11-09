import { ConsoleWindow } from "@src/utils/ConsoleWindow";

let consoleWindow: ConsoleWindow;
const queue: { args: any[] }[] = [];

export const initConsoleWindow = async () => {
  if (!consoleWindow || !consoleWindow.isDestroyed()) {
    consoleWindow = await ConsoleWindow.create();

    const interval = setInterval(() => {
      if (queue.length === 0) return;
      const item = queue.shift()!;
      consoleWindow.log(...item.args);
    }, 100);
    consoleWindow.on("close", () => {
      clearInterval(interval);
    });
  }

  return consoleWindow;
};

export const logger = {
  log(...args: any[]) {
    console.log(...args);
    queue.push({ args });
  },
};
