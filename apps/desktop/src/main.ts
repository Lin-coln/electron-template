import { app, BrowserWindow, Rectangle, screen } from "electron";
import {
  INDEX_FILENAME,
  INDEX_URL,
  NO_FOCUS,
  PRELOAD_FILENAME,
} from "@src/utils";

import { DevToolsWindow } from "@src/utils/window";

import stage2_initialize from "@src/initialize/stage2_initialize";
import stage1_registry from "@src/initialize/stage1_registry";
import stage0_check from "@src/initialize/stage0_check";
import { logger } from "@src/utils/logger";
import { getAppWindowOptions } from "@src/utils/window";
import { ConsoleWindow } from "@src/windows/ConsoleWindow";

void main();

async function main() {
  await stage0_check();
  await stage1_registry();

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  await app.whenReady();

  // createLoadingWindow

  await stage2_initialize();

  // handleCreateMainWindow
  app.on("activate", async () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length !== 0) return;
    await createWindows();
  });

  await createWindows();
}

async function createWindows() {
  const consoleWindow = await ConsoleWindow.create();
  const mainWindow = await createMainWindow();
  mainWindow.on("closed", () => {
    consoleWindow.destroy();
  });
}

async function createMainWindow() {
  const options = getAppWindowOptions({
    preload: PRELOAD_FILENAME,
    display: 1,
    placement: [0.3, "center"],
    width: 1200,
    height: 900,
  });

  const mainWindow: BrowserWindow = new BrowserWindow(options);

  // watchShortcuts
  app.on("browser-window-created", (_, window) => {
    // optimizer.watchWindowShortcuts(window)
  });

  if (INDEX_URL) {
    await mainWindow.loadURL(INDEX_URL);
  } else {
    await mainWindow.loadFile(INDEX_FILENAME);
  }

  if (NO_FOCUS) {
    const windowShowPromise = new Promise<void>((resolve) =>
      mainWindow.once("show", () => resolve()),
    );
    // no focus when reboot app from dev:main
    mainWindow.showInactive();
    await windowShowPromise;
  } else {
    mainWindow.show();
  }

  new DevToolsWindow(mainWindow, {
    display: 1,
    placement: ["right", "bottom"],
    margin: 76,
    width: 800,
    height: 600,
  }).open();

  logger.log(`[main] window created`);
  return mainWindow;
}
