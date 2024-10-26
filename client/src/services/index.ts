import foobarService from "@src/services/foobar.service";
import { ipcMain } from "electron";
import { Service } from "service";
export default {
  async initialize() {
    ipcMain.on(`Service#getInitialState`, async (event) => {
      event.returnValue = await collectElectronState();
    });

    await foobarService.load();
    console.log("services initialized");
  },
};

async function collectElectronState(): Promise<ElectronState> {
  return {
    services: Array.from(Service.Manager.services.keys()),
  };
}
