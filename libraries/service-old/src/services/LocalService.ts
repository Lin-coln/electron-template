import Service from "../core/Service";
import LocalServiceMiddleware from "../middlewares/LocalServiceMiddleware";
import { ServiceApi, ServiceApiHandlers } from "@src/types";

class LocalService<Api extends ServiceApi> extends Service<Api> {
  constructor(name: string, type: string, handlers: ServiceApiHandlers<Api>) {
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
