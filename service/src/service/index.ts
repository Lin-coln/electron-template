namespace service {
  // serialize
  type Primitive = undefined | null | boolean | number | string;
  type Serializable = Primitive | Serializable[] | Record<string, Serializable>;

  export namespace utils {
    export type UnwrapAsyncFn<
      Fn extends (...args: A) => Promise<R>,
      A extends any[] = any[],
      R extends Serializable = unknown,
    > = (...args: A) => R | Promise<R>;

    export type UnwrapArgs<
      Fn extends (...args: A) => Promise<R>,
      A extends any[] = any[],
      R extends Serializable = unknown,
    > = A;

    export type UnwrapResult<
      Fn extends (...args: A) => Promise<R>,
      A extends any[] = any[],
      R extends Serializable = unknown,
    > = R;
  }

  export type ServiceApi = Record<
    string,
    <R extends Serializable>(...args: any[]) => Promise<R>
  >;

  export type ServiceHandler<
    IService extends Record<
      string,
      <R extends Serializable>(...args: any[]) => Promise<R>
    >,
  > = {
    [key in keyof IService]: utils.UnwrapAsyncFn<IService[key]>;
  };

  export interface ServiceApiAdapter {
    enable(): Promise<void>;

    observe(
      handler: <Api extends ServiceApi, K extends keyof Api>(
        name: K,
        args: utils.UnwrapArgs<Api[K]>,
      ) => Promise<utils.UnwrapResult<Api[K]>>,
    ): void;

    dispatch<Api extends ServiceApi, K extends keyof Api>(
      name: K,
      args: utils.UnwrapArgs<Api[K]>,
    ): Promise<utils.UnwrapResult<Api[K]>>;
  }

  export interface Service<Api extends ServiceApi> {
    adapter: ServiceApiAdapter;
    handler: ServiceHandler<Api>;
    enable(): Promise<void>;
  }
}

class Service<Api extends service.ServiceApi> implements service.Service<Api> {
  handler: service.ServiceHandler<Api>;
  adapter;

  constructor(opts: {
    handler: service.ServiceHandler<Api>;
    adapter: service.ServiceApiAdapter;
  }) {
    this.handler = opts.handler;
    this.adapter = opts.adapter;
    // init
    this.adapter.observe(async (name, args) => {
      if (!Object.keys(this.handler).includes(name)) return;
      return this.handler(...args);
    });
  }

  async enable() {
    await this.adapter.enable();
  }
}

class ElectronAdapter implements service.ServiceApiAdapter {
  dispatch<Api extends service.ServiceApi, K extends keyof Api>(
    name: K,
    args: service.utils.UnwrapArgs<Api[K]>,
  ): Promise<service.utils.UnwrapResult<Api[K]>> {
    return Promise.resolve(undefined);
  }

  enable(): Promise<void> {
    return Promise.resolve(undefined);
  }

  observe(
    handler: <Api extends service.ServiceApi, K extends keyof Api>(
      name: K,
      args: service.utils.UnwrapArgs<Api[K]>,
    ) => Promise<service.utils.UnwrapResult<Api[K]>>,
  ): void {}
  //
}

interface FoobarService extends service.ServiceApi {
  foo(foo: number, bar: string): Promise<number>;
  foobar(): Promise<Foobar>;
}

type Foobar = { id: string; name: string };

const foobarHandler: service.ServiceHandler<FoobarService> = {
  foo(foo, bar) {
    return 0;
  },
  foobar(): Promise<Foobar> {
    return 0 as any;
  },
};

const foobarService = new Service<FoobarService>({
  handler: foobarHandler,
  adapter: new ElectronAdapter(),
});
