import resolveWithMiddlewares from "./resolveWithMiddlewares";
import ServiceManager from "./ServiceManager";

class Service<Api extends service.ServiceApi> implements service.Service<Api> {
  static _manager: ServiceManager;
  static get Manager() {
    if (!this._manager) {
      this._manager = new ServiceManager();
    }
    return this._manager;
  }

  readonly name: string;
  middlewares: service.ServiceMiddleware<Api>[];
  constructor(name: string) {
    this.name = name;
    this.middlewares = [];
    Service.Manager.appendService(this);
  }

  use(middleware: service.ServiceMiddleware<Api>): this {
    this.middlewares.push(middleware);
    return this;
  }

  load(): Promise<void> {
    return resolveWithMiddlewares<service.ServiceMiddleware<Api>>({
      middlewares: [...this.middlewares],
      resolve: (middleware, _, next) =>
        middleware.load ? middleware.load(next) : next(),
      next: () => void 0,
    });
  }

  collectMetadata(): Promise<service.metadata.ServiceMetadata> {
    return resolveWithMiddlewares<service.ServiceMiddleware<Api>>({
      middlewares: [...this.middlewares],
      resolve: (middleware, _, next) =>
        middleware.collectMetadata ? middleware.collectMetadata(next) : next(),
      next: () => {
        throw new Error(`failed to collectMetadata`);
      },
    });
  }

  invoke<Args extends any[] = any[], R extends service.Serializable = unknown>(
    chain: string[],
    args: Args,
  ): Promise<R> {
    return resolveWithMiddlewares<service.ServiceMiddleware<Api>>({
      middlewares: [...this.middlewares],
      context: { chain, args },
      resolve: (middleware, context, next) =>
        middleware.invoke
          ? middleware.invoke(context.chain, context.args, next)
          : next(),
      next: () => {
        throw new Error(`failed to invoke`);
      },
    });
  }
}

export default Service;
