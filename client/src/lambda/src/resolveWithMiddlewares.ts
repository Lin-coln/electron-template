export function resolveWithMiddlewares<
  Middleware = <Ctx, T>(ctx: Ctx, next: () => Promise<T>) => Promise<T>,
  Context = any,
  T = any,
>(options: {
  middlewares: Middleware[];
  context?: Context;
  resolve?: (
    middleware: Middleware,
    context: Context,
    next: () => Promise<T>,
  ) => Promise<T>;
  next: () => Promise<T> | void;
}): Promise<T> {
  if (!options.middlewares.length) {
    return options.next() as any;
  }

  const middleware: Middleware = options.middlewares.shift()!;
  options.resolve ??= (middleware, context, next) =>
    (middleware as any)(context, next) as Promise<T>;
  return options.resolve(middleware, options.context!, () =>
    resolveWithMiddlewares(options),
  );
}
