import { ElectronMainService } from "service/electron";
import { ServiceApiHandlers } from "service";

const foobarHandler: ServiceApiHandlers<FoobarService> = {
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

const foobarService = new ElectronMainService<FoobarService>(
  "foobar",
  foobarHandler,
);

export default foobarService;
