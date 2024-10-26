import { contextBridge, ipcRenderer } from "electron";
import ClientFactory from "@src/service/ClientFactory";

console.log(`[preload] Service#getInitialState...`);
const timestamp = Date.now();
const state: ElectronState = ipcRenderer.sendSync(`Service#getInitialState`);
console.log(`[preload] InitialState:`, state);

window.electron = {
  get_services_schema: async () => {
    return state.services_schema;
  },
  invoke_service: async (name: string, chain: string[], args: any[]) => {
    return ipcRenderer.invoke(`ServiceChannel#${name}`, "invoke", chain, args);
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

window.addEventListener("DOMContentLoaded", async () => {
  const factory = new ClientFactory({
    async onFetchSchemas(): Promise<Record<string, ServiceSchema>> {
      return await window.electron.get_services_schema();
    },
    async onInvoke(name: string, chain: string[], args: any[]): Promise<any> {
      return await window.electron.invoke_service(name, chain, args);
    },
  });
  await factory.fetchSchemas();

  const client = factory.get<FoobarService>("foobar");
  console.log(client.foo);
  console.log(`client test`, await client.foo(89));
});
