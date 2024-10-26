import foobarService from "@src/services/foobar.service";
import { ipcMain } from "electron";
import { Service } from "service";
export default {
  async initialize() {
    ipcMain.on(`ServiceManager#services`, async (event) => {
      event.returnValue = Array.from(Service.Manager.services.keys());
    });

    await foobarService.load();
    console.log("services initialized");
  },
};
