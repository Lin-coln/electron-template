declare namespace service {
  // serialize
  export type Primitive = undefined | null | boolean | number | string;
  export type Serializable =
    | Primitive
    | Serializable[]
    | Record<string, Serializable>;
  export type ServiceEndpoint = <
    A extends any[] = any[],
    R extends Serializable = unknown,
  >(
    ...args: A
  ) => Promise<R>;

  export type ServiceApi = Record<string, ServiceEndpoint | ServiceApi>;

  export type ServiceApiHandlers<Api extends service.ServiceApi> = {
    [key in keyof Api]: Api[key] extends Record<any, any>
      ? ServiceApiHandlers<Api[key]>
      : utils.UnwrapAsyncFn<Api[key]>;
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

  export namespace metadata {
    export type ServiceSchema = Record<string, "endpoint" | ServiceSchema>;
    export type ServiceMetadata = {
      name: string;
      schema: ServiceSchema;
    };
  }

  export interface ServiceMiddleware<Api extends ServiceApi> {
    service: Service<Api>;
    load?(next: () => Promise<void>): Promise<void>;
    collectMetadata?(
      next: () => Promise<metadata.ServiceMetadata>,
    ): Promise<metadata.ServiceMetadata>;
    invoke?<Args extends any[] = any[], R extends Serializable = unknown>(
      chain: string[],
      args: Args,
      next: () => Promise<R>,
    ): Promise<R>;
  }

  export interface Service<Api extends ServiceApi> {
    name: string;
    middlewares: ServiceMiddleware<Api>[];
    // schema: metadata.ServiceSchema | null;
    // handlers: metadata.ServiceHandlers<Api>;
    load(): Promise<void>;
    // unload():Promise<void>;

    collectMetadata(): Promise<metadata.ServiceMetadata>;
    invoke<Args extends any[] = any[], R extends Serializable = unknown>(
      chain: string[],
      args: Args,
    ): Promise<R>;
  }
}
