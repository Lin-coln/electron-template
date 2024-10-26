import { ipcMain } from "electron";

export function setupIpcHandler({ name, onInvoked }) {
  const channel = `ServiceChannel#${name}`;
  ipcMain.handle(
    channel,
    async (event, type: string, chain: string[], args: any[]) => {
      if (type === "invoke") {
        return await onInvoked(chain, args);
      }
    },
  );
}
