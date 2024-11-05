import resolveWithMiddlewares from "./resolveWithMiddlewares";
import ServiceManager from "./ServiceManager";
import {
  ServiceApi,
  ServiceMiddleware,
  Service as IService,
  ServiceMetadata,
  Serializable,
} from "@src/types";

class Service<Api extends ServiceApi> implements IService<Api> {
  static _manager: ServiceManager;
  static get Manager(): ServiceManager {
    if (!this._manager) {
      this._manager = new ServiceManager();
    }
    return this._manager;
  }

  readonly name: string;
  middlewares: ServiceMiddleware<Api>[];
  constructor(name: string) {
    this.name = name;
    this.middlewares = [];
    Service.Manager.appendService(this);
  }

  use(middleware: ServiceMiddleware<Api>): this {
    this.middlewares.push(middleware);
    return this;
  }

  load(): Promise<void> {
    return resolveWithMiddlewares<ServiceMiddleware<Api>>({
      middlewares: [...this.middlewares],
      resolve: (middleware, _, next) =>
        middleware.load ? middleware.load(next) : next(),
      next: () => void 0,
    });
  }

  collectMetadata(): Promise<ServiceMetadata> {
    return resolveWithMiddlewares<ServiceMiddleware<Api>>({
      middlewares: [...this.middlewares],
      resolve: (middleware, _, next) =>
        middleware.collectMetadata ? middleware.collectMetadata(next) : next(),
      next: () => {
        throw new Error(`failed to collectMetadata`);
      },
    }) as any;
  }

  invoke<Args extends any[] = any[], R extends Serializable = unknown>(
    chain: string[],
    args: Args,
  ): Promise<R> {
    return resolveWithMiddlewares<ServiceMiddleware<Api>>({
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
