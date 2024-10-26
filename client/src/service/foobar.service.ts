import Service from "./Service";

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

const foobarService = new Service<any>({
  name: "foobar",
  handlers: foobarHandler,
});

export default foobarService;
