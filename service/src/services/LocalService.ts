import Service from "../core/Service";
import LocalServiceMiddleware from "../middlewares/LocalServiceMiddleware";

class LocalService<Api extends service.ServiceApi> extends Service<Api> {
  constructor(
    name: string,
    type: string,
    handlers: service.ServiceApiHandlers<Api>,
  ) {
    super(name);
    this.use(
      new LocalServiceMiddleware(this, {
        type,
        handlers,
      }),
    );
  }
}

export default LocalService;
