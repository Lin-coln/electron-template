declare namespace service {
  // serialize
  type Primitive = undefined | null | boolean | number | string;
  type Serializable = Primitive | Serializable[] | Record<string, Serializable>;
  export type ServiceHandler = <A extends any[], R extends Serializable>(
    ...args: A
  ) => Promise<R>;
  export type ServiceApi = Record<string, ServiceHandler | ServiceApi>;

  export type ServiceHandlers<IService extends ServiceApi> = {
    [key in keyof IService]: IService[key] extends Record<any, any>
      ? ServiceHandlers<IService[key]>
      : utils.UnwrapAsyncFn<IService[key]>;
  };

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

  export namespace schema {
    type ServiceSchema = Record<string, "endpoint" | ServiceSchema>;
  }

  export interface Service<Api extends ServiceApi> {
    handlers: ServiceHandlers<Api>;
    enable(): Promise<void>;
    // invoke<K extends keyof Api>(
    //   name: K,
    //   ...args: utils.UnwrapArgs<Api[K]>
    // ): Promise<utils.UnwrapResult<Api[K]>>;
  }
}
