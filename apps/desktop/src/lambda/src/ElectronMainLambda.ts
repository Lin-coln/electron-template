// import { LambdaPeer } from "@src/lambda/src/index";
// import {
//   BrowserWindow,
//   ipcMain,
//   ipcRenderer,
//   webContents,
//   WebContents,
// } from "electron";
// import * as events from "node:events";
//
// const LAMBDA_CHANNEL = `LambdaChannel`;
// const Signal = {
//   Broadcast: `${LAMBDA_CHANNEL}#Signal.Broadcast`,
//   Notify: `${LAMBDA_CHANNEL}#Signal.Notify`,
// };
// const SignalBroadcast = {
//   PeerCreated: `PeerCreated`,
// };
// const SignalNotify = {
//   PeerFound: `PeerFound`,
// };
//
// class ElectronSignal extends events.EventEmitter {
//   peers: string[];
//   peerOptions: Map<
//     string,
//     | {
//         type: "main"; // main
//         id: string;
//         pid: string;
//       }
//     | {
//         type: "renderer"; // renderer
//         id: string;
//         pid: string;
//         wid: string;
//       }
//   >;
//
//   constructor() {
//     super();
//     this.peers = [];
//     this.peerOptions = new Map();
//
//     this.on(Signal.Broadcast, (args) => this.#handleBroadcast(args));
//     ipcMain.on(Signal.Broadcast, (ipcEvent, args) => {
//       this.emit(Signal.Broadcast, args);
//     });
//   }
//
//   async #handleBroadcast({ message, payload }) {
//     if (message === SignalBroadcast.PeerCreated) {
//       await this.onPeerCreated(payload.id);
//     }
//   }
//
//   protected onPeerCreated(id: string) {
//     // step1: store the peer
//     const type = id.startsWith(`ElectronMain#`)
//       ? "main"
//       : id.startsWith(`ElectronRenderer#`)
//         ? "renderer"
//         : "unknown";
//     if (type === "unknown") {
//       console.warn(`unknown peer created: ${id}`);
//       return;
//     }
//     // main process
//     else if (type === "main") {
//       this.peers.push(id);
//       const pid = id.slice(`ElectronMain#`.length);
//       this.peerOptions.set(id, { type, id, pid });
//     }
//     // renderer process
//     else if (type === "renderer") {
//       const pid = id.slice(`ElectronRenderer#`.length);
//       const win: BrowserWindow = BrowserWindow.getAllWindows()
//         // find browser win by pid
//         .find((win) => win.webContents.getProcessId().toString() === pid)!;
//       const wid = win.webContents.id.toString();
//       this.peers.push(id);
//       this.peerOptions.set(id, { type, id, pid, wid });
//     }
//
//     // step2: notify other peers
//     // todo: parallel notify
//     void Promise.resolve().then(async () => {
//       const target_peer = id;
//       for (const current_peer of this.peers) {
//         if (current_peer === id) continue; // skip to notify self
//         if (!this.peers.includes(id)) break; // break if target peer disconnected
//         if (!this.peers.includes(current_peer)) continue; // skip if current peer disconnected
//         const target_options = this.peerOptions.get(id)!;
//         const current_options = this.peerOptions.get(current_peer)!;
//         await Promise.all([
//           this.#notify(current_peer, SignalNotify.PeerFound, target_options), // notify current peer
//           this.#notify(target_peer, SignalNotify.PeerFound, current_options), // notify target peer
//         ]);
//       }
//     });
//   }
//
//   async #notify(peer: string, message: string, payload: any) {
//     const option = this.peerOptions.get(peer);
//     if (option.type === "main") {
//       this.emit(Signal.Notify, { message, payload });
//     } else if (option.type === "renderer") {
//       const wc: WebContents = webContents.fromId(option.wid);
//       wc.send(Signal.Notify, { message, payload });
//     } else {
//       console.warn(`failed to notify unknown peer: ${peer}`);
//     }
//   }
// }
//
// class ElectronMainPeer extends LambdaPeer {
//   signal: ElectronSignal;
//   constructor(signal: ElectronSignal) {
//     super(`ElectronMain#${process.pid}`);
//     this.signal = signal;
//   }
//
//   public async initialize() {
//     // listen signal
//     this.signal.on(Signal.Notify, ({ message, payload }) => {
//       void this.onNotify(message, payload);
//     });
//     await this.broadcast(SignalBroadcast.PeerCreated, { id: this.id });
//   }
//
//   public async broadcast(message: string, payload: any) {
//     this.signal.emit(Signal.Broadcast, { message, payload });
//   }
//
//   protected async onNotify(message: string, payload: any) {
//     if (message === SignalNotify.PeerFound) {
//       const peerOption = payload;
//       if (peerOption.type === "renderer") {
//         // connect to renderer peer
//       }
//       console.warn(`unhandled peer found`, peerOption);
//     }
//   }
// }
//
// class ElectronRendererPeer extends LambdaPeer {
//   constructor() {
//     super(`ElectronRenderer#${process.pid}`);
//   }
//
//   public async initialize() {
//     // listen signal
//     ipcRenderer.on(Signal.Notify, (ipcEvent, { message, payload }) => {
//       void this.onNotify(message, payload);
//     });
//     await this.broadcast(SignalBroadcast.PeerCreated, { id: this.id });
//   }
//
//   public async broadcast(message: string, payload: any): Promise<void> {
//     await ipcRenderer.invoke(Signal.Broadcast, {
//       message,
//       payload,
//     });
//   }
//
//   protected async onNotify(message: string, payload: any) {
//     if (message === SignalNotify.PeerFound) {
//       const peerOption = payload;
//       if (peerOption.type === "main") {
//         // connect to main peer
//       }
//       console.warn(`unhandled peer found`, peerOption);
//     }
//   }
// }
