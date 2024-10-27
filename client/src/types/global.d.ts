import { ServiceMetadata } from "service";
import { ServiceApi } from "service";

declare global {
  const process: any;

  interface Window {
    electron: {
      service: {
        services: string[];
        invoke(name: string, chain: string[], args: any[]): Promise<any>;
        collectMetadata(name: string): Promise<ServiceMetadata>;
      };
    };
  }

  interface FoobarService extends ServiceApi {
    foo(foo: number): Promise<number>;
    foobar(): Promise<Foobar>;
    bar: {
      bar(): Promise<string>;
    };
  }

  type Foobar = { id: string; name: string };
}
