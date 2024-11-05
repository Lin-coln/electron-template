// export type Primitive = undefined | null | boolean | number | string;
//
// // @ts-ignore
// export type Serializable =
//   | Primitive
//   | Serializable[]
//   | Record<string, Serializable>;
//
// export type LambdaHandler = <
//   A extends Serializable[] = Serializable[],
//   R extends Serializable = Serializable,
// >(
//   ...args: A
// ) => Promise<R>;
//
// export type LambdaGraph = Record<
//   string,
//   LambdaGraph & {
//     [Symbol.for("lambda_id")]?: string;
//   }
// >;
//
// export type LambdaMetadata = {
//   id: string;
//   peer: string;
//   paths: string[];
// };
