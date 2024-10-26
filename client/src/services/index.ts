import foobarService from "@src/services/foobar.service";
import { ipcMain } from "electron";
import Service from "@src/services/Service";
export default {
  async initialize() {
    ipcMain.on(`Service#getInitialState`, async (event) => {
      event.returnValue = await collectElectronState();
    });
    async function collectElectronState(): Promise<ElectronState> {
      const services_schema: any = {};
      Array.from(Service.services.values()).forEach((service) => {
        services_schema[service.name] = parseSchema(service);
      });
      return {
        services_schema,
      };
      function parseSchema(service: service.Service<unknown>) {
        const res = {};
        const main = (target: any, source: any) => {
          const keys = Object.keys(source);
          keys.forEach((key) => {
            if (typeof source[key] === "function") {
              target[key] = "endpoint";
            } else {
              target[key] = {};
              main(target[key], source[key]);
            }
          });
        };
        main(res, service.handlers);
        return res;
      }
    }

    await foobarService.enable();
    console.log("service initialized");
  },
};
