class ClientFactory {
  clients: Map<string, any> = new Map();
  schemas: Record<string, service.schema.ServiceSchema> | null;

  private onFetchSchemas: () => Promise<
    Record<string, service.schema.ServiceSchema>
  >;
  private onInvoke: (
    name: string,
    chain: string[],
    args: any[],
  ) => Promise<any>;

  constructor(options: {
    onFetchSchemas(): Promise<Record<string, service.schema.ServiceSchema>>;
    onInvoke(name: string, chain: string[], args: any[]): Promise<any>;
  }) {
    this.onFetchSchemas = options.onFetchSchemas;
    this.onInvoke = options.onInvoke;
    this.schemas = null;
  }

  async fetchSchemas() {
    this.schemas = await this.onFetchSchemas();
  }

  private async invoke(name: string, chain: string[], args: any[]) {
    return this.onInvoke(name, chain, args);
  }

  get<T>(name: string): T {
    if (!this.schemas) {
      throw new Error(`schemas not found, call fetchSchemas first`);
    }
    if (name in this.schemas) {
      return this.getClient(name, this.schemas[name]);
    }
    throw new Error(`service schema not found: ${name}`);
  }

  private getClient(
    uuid: string,
    target: service.schema.ServiceSchema | "endpoint",
  ) {
    if (!this.clients.has(uuid)) {
      this.clients.set(uuid, this.createProxy(uuid, target));
    }
    return this.clients.get(uuid)!;
  }

  private createProxy(
    uuid: string,
    source: service.schema.ServiceSchema | "endpoint",
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
          return this.getClient(`${uuid}.${prop}`, val);
        }
        if (val === "endpoint") {
          return this.getClient(`${uuid}.${prop}`, val);
        }
      },
      apply: (_, endpointProxy: any, args: any[]) => {
        if (source !== "endpoint") {
          throw new Error(`failed to call client: not an endpoint`);
        }
        const [name, ...chain] = uuid.split(".");
        return this.invoke(name, chain, args);
      },
    });
  }
}

export default ClientFactory;
