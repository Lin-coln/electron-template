// import foobarService from "@src/services/foobar.service";
import { ipcMain } from "electron";
// import { Service } from "service";

// import { LambdaManager } from "@src/lambda/src";
// import ElectronWebContentsPeer from "@src/lambda/src/ElectronWebcontentsPeer";
// let manager: LambdaManager;

import { FOOBAR } from "@lib/electron-utils";

export default {
  async initialize() {
    console.log(FOOBAR);
    ipcMain.on(`ServiceManager#services`, async (event) => {
      // event.returnValue = Array.from(Service.Manager.services.keys());
      event.returnValue = [];
    });
    // await foobarService.load();
    // manager = await LambdaManager.create({
    //   foobar() {
    //     return {
    //       id: "foobar_id",
    //       name: "foobar_name",
    //     };
    //   },
    // });
    console.log("services initialized");
  },

  // addWebContentsPeer(webContents) {
  //   manager.peerManager.add(new ElectronWebContentsPeer(webContents));
  // },
};
