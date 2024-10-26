import Service from "./Service";

class ServiceInvoker {
  // uuid = `${name}.${chain.join('.')}
  invokeNodes: Map<string, any>;
  constructor() {
    this.invokeNodes = new Map();
  }

  async get<T>(name: string): Promise<T> {
    const service = Service.Manager.getService(name);
    const metadata = await service.collectMetadata();
    return this.getInvokeNode(metadata.name, metadata.schema);
  }

  getInvokeNode(
    uuid: string,
    target: service.metadata.ServiceSchema | "endpoint",
  ) {
    if (!this.invokeNodes.has(uuid)) {
      this.invokeNodes.set(uuid, createProxy(this, uuid, target));
    }
    return this.invokeNodes.get(uuid)!;
  }
}

export default ServiceInvoker;

function createProxy(
  invoker: ServiceInvoker,
  uuid: string,
  source: service.metadata.ServiceSchema | "endpoint",
) {
  let target = {};
  if (source === "endpoint") {
    target = Object.defineProperties(() => `remote method`, {
      name: { value: uuid },
    });
  }

  return new Proxy(target, {
    get: (_, prop: string) => {
      if (source === "endpoint") return;
      const val = source[prop];
      if (val && typeof val === "object") {
        return invoker.getInvokeNode(`${uuid}.${prop}`, val);
      }
      if (val === "endpoint") {
        return invoker.getInvokeNode(`${uuid}.${prop}`, val);
      }
    },
    apply: (_, endpointProxy: any, args: any[]) => {
      if (source !== "endpoint") {
        throw new Error(`failed to call client: not an endpoint`);
      }
      const [name, ...chain] = uuid.split(".");
      return Service.Manager.getService(name).invoke(chain, args);
    },
  });
}
