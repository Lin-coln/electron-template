import { contextBridge, ipcRenderer } from "electron";
import { Service, ServiceInvoker } from "service";
import { ServiceApi, ServiceMiddleware, Serializable } from "service";

console.log(`[preload] ServiceManager#services...`);
const timestamp = Date.now();
const services: string[] = ipcRenderer.sendSync(`ServiceManager#services`);
console.log(`[preload] services:`, services);

window.electron = {
  service: {
    services,
    invoke: async (name: string, chain: string[], args: any[]) => {
      return ipcRenderer.invoke(
        `ServiceChannel#${name}`,
        "invoke",
        chain,
        args,
      );
    },
    collectMetadata: async (name: string) => {
      return ipcRenderer.invoke(`ServiceChannel#${name}`, "collectMetadata");
    },
  },
};
contextBridge.exposeInMainWorld("electron", window.electron);

console.log(
  `[preload] done. cost: ${Math.round((Date.now() - timestamp) * 1000) / 1000} ms`,
);

/////////////////////////////////////////////////////////////////

class RemoteServiceMiddleware<Api extends ServiceApi>
  implements ServiceMiddleware<Api>
{
  service: Service<Api>;
  type: string;
  constructor(service, type) {
    this.service = service;
    this.type = type;
  }

  collectMetadata() {
    if (this.type !== "electron_main") {
      throw new Error(`cannot resolve type`);
    }
    return window.electron.service.collectMetadata(this.service.name);
  }

  invoke<Args extends any[] = any[], R extends Serializable = unknown>(
    chain: string[],
    args: Args,
    next: () => Promise<R>,
  ): Promise<R> {
    if (this.type !== "electron_main") {
      throw new Error(`cannot resolve type`);
    }
    return window.electron.service.invoke(this.service.name, chain, args);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  await Promise.all(
    window.electron.service.services.map(async (name) => {
      const metadata = await window.electron.service.collectMetadata(name);
      const service = new Service(name);
      service.use(new RemoteServiceMiddleware(service, metadata.type));
      await service.load();
    }),
  );

  const invoker = new ServiceInvoker();
  const client = await invoker.get<FoobarService>("foobar");
  console.log(client.foobar);
  console.log(`client`, await client.foobar());
});
