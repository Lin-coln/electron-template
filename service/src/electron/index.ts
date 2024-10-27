// @ts-ignore
import { LocalService, ServiceApi } from "service";
// @ts-ignore
import { ipcMain } from "electron";

export class ElectronMainService<
  Api extends ServiceApi,
> extends LocalService<Api> {
  constructor(name, handlers) {
    super(name, "electron_main", handlers);
    // @ts-ignore
    const channel = `ServiceChannel#${this.name}`;
    // @ts-ignore
    ipcMain.handle(
      channel,
      async (event, type: string, chain: string[], args: any[]) => {
        if (type === "invoke") {
          // @ts-ignore
          return await this.invoke(chain, args);
        } else if (type === "collectMetadata") {
          // @ts-ignore
          return await this.collectMetadata();
        }
      },
    );
  }
}
