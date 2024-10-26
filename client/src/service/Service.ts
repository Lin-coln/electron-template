import { ipcMain } from "electron";

class Service<Api extends service.ServiceApi> implements service.Service<Api> {
  static services: Map<string, Service<unknown>> = new Map();

  name: string;
  handlers: service.ServiceHandlers<Api>;
  middlewares: any[];
  constructor(opts: { name: string; handlers: service.ServiceHandlers<Api> }) {
    this.name = opts.name;
    this.handlers = opts.handlers;

    const HandlerMiddleware = () => {
      const map = new Map<string, null | service.ServiceHandler>();
      return async (ctx, next) => {
        const chain_id = ctx.chain.join(".");
        if (!map.has(chain_id)) {
          map.set(chain_id, getHandler(this.handlers, ctx.chain));
        }

        ctx.handler = map.get(chain_id);
        return await next();
      };

      function getHandler<Api>(
        handlers: service.ServiceHandlers<Api>,
        chain: string[],
      ): service.ServiceHandler | null {
        let cur: any = handlers;
        while (true) {
          const key = chain.shift();
          if (key && key in cur) {
            const val = cur[key];
            if (val) {
              if (typeof val === "object" && chain.length !== 0) {
                continue;
              } else if (typeof val === "function" && chain.length === 0) {
                return val.bind(cur) as service.ServiceHandler;
              }
            }
          }
          return null;
        }
      }
    };
    this.middlewares = [HandlerMiddleware()];

    Service.services.set(this.name, this);
  }

  async enable() {
    addIpcListeners({
      name: this.name,
      onInvoked: this.onInvoked.bind(this),
    });

    function addIpcListeners({ name, onInvoked }: any) {
      const channel = `ServiceChannel#${name}`;
      ipcMain.handle(
        channel,
        async (event, type: string, chain: string[], args: any[]) => {
          if (type === "invoke") {
            return await onInvoked(chain, args);
          }
        },
      );
    }
  }

  private onInvoked<T>(
    chain: string[],
    args: any[],
  ): undefined | T | Promise<undefined | T> {
    const context: {
      chain: string[];
      args: any[];
      handler: null | service.ServiceHandler;
    } = { chain, args, handler: null };
    return resolveWithMiddlewares({
      context,
      middlewares: [...this.middlewares],
      next: () => {
        if (!context.handler) return;
        return context.handler(...context.args);
      },
    });
  }
}

export default Service;

function resolveWithMiddlewares<
  Middleware = <Ctx, T>(ctx: Ctx, next: () => T | Promise<T>) => T | Promise<T>,
  Context = any,
  T = unknown,
>(options: {
  middlewares: Middleware[];
  context: Context;
  resolve?: (
    middleware: Middleware,
    context: Context,
    next: () => T | Promise<T>,
  ) => T | Promise<T>;
  next: () => T | Promise<T>;
}): T | Promise<T> {
  if (!options.middlewares.length) {
    return options.next();
  }

  const middleware: Middleware = options.middlewares.pop()!;
  options.resolve ??= (middleware, context, next) =>
    (middleware as any)(context, next) as T | Promise<T>;
  return options.resolve(middleware, options.context, () =>
    resolveWithMiddlewares(options),
  );
}
