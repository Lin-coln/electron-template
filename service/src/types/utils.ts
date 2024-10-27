import {Serializable} from "@src/types/base";

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