import { contextBridge, ipcRenderer } from "electron";
import { Service, ServiceInvoker } from "service";

console.log(`[preload] Service#getInitialState...`);
const timestamp = Date.now();
const state: ElectronState = ipcRenderer.sendSync(`Service#getInitialState`);
console.log(`[preload] InitialState:`, state);

window.electron = {
  service: {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

/////////////////////////////////////////////////////////////////

class RemoteServiceMw<Api extends service.ServiceApi>
  implements service.ServiceMiddleware<Api>
{
  service: service.Service<Api>;
  constructor(service) {
    this.service = service;
  }

  collectMetadata() {
    return window.electron.service.collectMetadata(this.service.name);
  }

  invoke<Args extends any[] = any[], R extends service.Serializable = unknown>(
    chain: string[],
    args: Args,
    next: () => Promise<R>,
  ): Promise<R> {
    return window.electron.service.invoke(this.service.name, chain, args);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const service = new Service("foobar");
  service.use(new RemoteServiceMw(service));
  await service.load();

  const invoker = new ServiceInvoker();
  const client = await invoker.get<FoobarService>("foobar");

  console.log(client.foobar);
  console.log(`client`, await client.foobar());
});
