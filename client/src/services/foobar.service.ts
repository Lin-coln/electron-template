import { Service } from "service";
import { setupIpcHandler } from "@src/services/utils";

const foobarHandler: service.ServiceHandlers<any> = {
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

const foobarService = new Service<FoobarService>({
  name: "foobar",
  handlers: foobarHandler,
  onSetupInvokeHandler: setupIpcHandler,
});

export default foobarService;
