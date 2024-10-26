declare interface FoobarService extends service.ServiceApi {
  foo(foo: number): Promise<number>;
  foobar(): Promise<Foobar>;
  bar: {
    bar(): Promise<string>;
  };
}

declare type Foobar = { id: string; name: string };
