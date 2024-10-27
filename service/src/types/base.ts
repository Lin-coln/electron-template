export type Primitive = undefined | null | boolean | number | string;

// @ts-ignore
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

// @ts-ignore
export type ServiceApi = Record<string, ServiceEndpoint | ServiceApi>;
// @ts-ignore
export type ServiceSchema = Record<string, "endpoint" | ServiceSchema>;

export type ServiceMetadata = {
  name: string;
  type?: string;
  schema: ServiceSchema;
};
