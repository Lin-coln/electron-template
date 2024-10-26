class LocalServiceMiddleware<Api extends service.ServiceApi>
  implements service.ServiceMiddleware<Api>
{
  type: string;
  service: service.Service<Api>;
  handlers: service.ServiceApiHandlers<Api>;
  schema: service.metadata.ServiceSchema;
  constructor(
    service: service.Service<Api>,
    options: {
      type: string;
      handlers: service.ServiceApiHandlers<Api>;
    },
  ) {
    this.type = options.type;
    this.service = service;
    this.handlers = options.handlers;
    this.schema = parseSchema(this.handlers);
  }

  async load(next: () => Promise<void>): Promise<void> {
    this.schema = parseSchema(this.handlers);
    return next();
  }

  async collectMetadata(next) {
    return {
      name: this.service.name,
      type: this.type,
      schema: this.schema,
    };
  }

  invoke<Args extends any[] = any[], R extends service.Serializable = unknown>(
    chain: string[],
    args: Args,
    next: () => Promise<R>,
  ): Promise<R> {
    const handler = getHandler(this.handlers, chain);
    if (handler !== null) {
      return handler(...args);
    }
    return next();
  }
}
export default LocalServiceMiddleware;

function parseSchema(
  handlers: service.ServiceApiHandlers<unknown>,
): service.metadata.ServiceSchema {
  const res: any = {};
  const main = (target: any, source: any) => {
    const keys = Object.keys(source);
    keys.forEach((key) => {
      if (typeof source[key] === "function") {
        target[key] = "endpoint";
      } else {
        target[key] = {};
        main(target[key], source[key]);
      }
    });
  };
  main(res, handlers);
  return res;
}

function getHandler(
  handlers: service.ServiceApiHandlers<unknown>,
  chain: string[],
): service.ServiceEndpoint | null {
  let cur: any = handlers;
  while (true) {
    const key = chain.shift();
    if (key && key in cur) {
      const val = cur[key];
      if (val) {
        if (typeof val === "object" && chain.length !== 0) {
          continue;
        } else if (typeof val === "function" && chain.length === 0) {
          return val.bind(cur) as any;
        }
      }
    }
    return null;
  }
}
