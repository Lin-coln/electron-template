import { utils } from "@src/types/utils";
import { Serializable, ServiceApi, ServiceMetadata } from "@src/types/base";

export type ServiceApiHandlers<Api extends ServiceApi> = {
  [key in keyof Api]: Api[key] extends Record<any, any>
    ? ServiceApiHandlers<Api[key]>
    : utils.UnwrapAsyncFn<Api[key]>;
};

export interface ServiceMiddleware<Api extends ServiceApi> {
  service: Service<Api>;
  load?(next: () => Promise<void>): Promise<void>;
  collectMetadata?(
    next: () => Promise<Partial<ServiceMetadata>>,
  ): Promise<Partial<ServiceMetadata>>;
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

  collectMetadata(): Promise<ServiceMetadata>;
  invoke<Args extends any[] = any[], R extends Serializable = unknown>(
    chain: string[],
    args: Args,
  ): Promise<R>;
}
