import { LocalServiceMw, Service } from "service";
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

const foobarService = new Service<FoobarService>("foobar");
foobarService.use(
  new LocalServiceMw(foobarService, {
    handlers: foobarHandler,
  }),
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
