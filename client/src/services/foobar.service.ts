import { LocalService } from "service";
import { ipcMain } from "electron";

const foobarHandler: service.ServiceApiHandlers<FoobarService> = {
  foo(foo) {
    return foo * 2;
  },
  foobar() {
    return {
      id: "foobar_id",
      name: "foobar_name",
    };
  },
  bar: {
    bar() {
      return "bar!";
    },
  },
};

const foobarService = new LocalService<FoobarService>(
  "foobar",
  "electron_main",
  foobarHandler,
);
const channel = `ServiceChannel#${foobarService.name}`;
ipcMain.handle(
  channel,
  async (event, type: string, chain: string[], args: any[]) => {
    if (type === "invoke") {
      return await foobarService.invoke(chain, args);
    } else if (type === "collectMetadata") {
      return await foobarService.collectMetadata();
    }
  },
);

export default foobarService;
