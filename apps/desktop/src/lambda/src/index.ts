// import {
//   LambdaHandler,
//   LambdaGraph,
//   LambdaMetadata,
//   Serializable,
// } from "../types";
// import { resolveWithMiddlewares } from "./resolveWithMiddlewares";
//
// class HandlerManager {
//   handlers: Map<string, LambdaHandler>;
//
//   constructor() {
//     this.handlers = new Map();
//   }
//
//   setHandler(id: string, handler: LambdaHandler): void {
//     this.handlers.set(id, handler);
//   }
//
//   hasHandler(id: string): boolean {
//     return this.handlers.has(id);
//   }
//
//   deleteHandler(id: string): boolean {
//     return this.handlers.delete(id);
//   }
//
//   invokeHandler<
//     A extends Serializable[] = Serializable[],
//     R extends Serializable = Serializable,
//   >(id: string, args: A): Promise<R> {
//     if (!this.handlers.has(id)) {
//       throw new Error(`failed to invokeHandler: not exists`);
//     }
//     return this.handlers.get(id).apply(undefined, args);
//   }
// }
//
// class GraphManager {
//   paths: Map<string, Set<string>>; // <id, paths>
//   graph: LambdaGraph;
//
//   constructor() {
//     this.paths = new Map();
//     this.graph = {};
//   }
//
//   getPath(id: string): Set<string> {
//     if (!this.paths.has(id)) {
//       throw new Error(`failed to getPath: id not exists`);
//     }
//     return this.paths.get(id)!;
//   }
//
//   resolveId(path: string): string | undefined {
//     const targetEntry = Array.from(this.paths.entries()).find(([_, paths]) =>
//       paths.has(path),
//     );
//     if (!targetEntry) return;
//     return targetEntry[0];
//   }
//
//   setPath(id: string, path: string): void {
//     if (this.paths.get(id)?.has(path)) return;
//     if (!this.paths.has(id)) {
//       this.paths.set(id, new Set());
//     }
//
//     const prev_id = this.resolveId(path);
//     if (prev_id) {
//       this.paths.get(prev_id)!.delete(path);
//     }
//
//     this.paths.get(id).add(path);
//     this.#updateGraph(path, (graph) => {
//       graph[Symbol.for("lambda_id")] = id;
//     });
//   }
//
//   deletePath(path: string): boolean {
//     const id = this.resolveId(path);
//     if (!id) return false;
//
//     this.paths.get(id)!.delete(path);
//     deleteId(this.graph, path.split("."));
//     function deleteId(graph, fields) {
//       if (!fields.length) {
//         delete graph[Symbol.for("lambda_id")];
//         return Object.keys(graph).length === 0;
//       }
//
//       const [field, ...restFields] = fields;
//       graph[field] ??= {};
//       const current = graph[field];
//       const isCurrentEmpty = deleteId(current, restFields);
//       if (isCurrentEmpty) delete graph[field];
//       return Object.keys(graph).length === 0;
//     }
//   }
//
//   #updateGraph(path: string, callback: (graph: LambdaGraph) => void) {
//     const fields = path.split(".");
//     let cur = this.graph;
//     while (fields.length) {
//       const field = fields.shift();
//       cur[field] ??= {};
//       cur = cur[field];
//       if (fields.length === 0) {
//         callback(cur);
//       }
//     }
//   }
// }
//
// class PeerManager {
//   peers: Map<string, Set<string>>; // <peer_name, id_set>;
//
//   constructor() {
//     this.peers = new Map();
//   }
//
//   resolveIdSet(category: string): Set<string> {
//     if (!this.peers.has(category)) {
//       this.peers.set(category, new Set());
//     }
//     return this.peers.get(category)!;
//   }
//
//   setPeer(id: string, peer: string): void {
//     if (!this.peers.has(peer)) {
//       this.peers.set(peer, new Set());
//     }
//     this.peers.get(peer)!.add(id);
//   }
// }
//
// export class LambdaPeer {
//   id: string;
//   handlerManager: HandlerManager;
//   graphManager: GraphManager;
//   peerManager: PeerManager;
//
//   constructor(id: string) {
//     this.id = id;
//     this.handlerManager = new HandlerManager();
//     this.graphManager = new GraphManager();
//     this.peerManager = new PeerManager();
//   }
//
//   async collectLambdaMetadata(): Promise<LambdaMetadata[]> {
//     const metadata: LambdaMetadata[] = Array.from(
//       this.peerManager.resolveIdSet(this.id),
//     )
//       // collect metadata
//       .map((id) => {
//         const paths = Array.from(this.graphManager.getPath(id));
//         return {
//           id,
//           paths,
//           peer: this.id,
//         };
//       });
//
//     return metadata;
//   }
// }
