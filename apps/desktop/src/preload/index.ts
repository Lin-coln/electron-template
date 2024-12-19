import IpcRendererEvent = Electron.IpcRendererEvent;
import { ipcRenderer } from "electron";

type Platform =
  | "aix"
  | "android"
  | "darwin"
  | "freebsd"
  | "haiku"
  | "linux"
  | "openbsd"
  | "sunos"
  | "win32"
  | "cygwin"
  | "netbsd";

type ProcessVersions = {
  http_parser: string;
  node: string;
  v8: string;
  ares: string;
  uv: string;
  zlib: string;
  modules: string;
  openssl: string;
};

interface ElectronAPI {
  ipcRenderer: {
    send(channel: string, ...args: any[]): void;
    sendSync(channel: string, ...args: any[]): any;
    sendToHost(channel: string, ...args: any[]): void;
    postMessage(channel: string, message: any, transfer?: MessagePort[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void,
    ): () => void;
    once(
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void,
    ): () => void;
    removeListener(
      channel: string,
      listener: (event: IpcRendererEvent, ...args: any[]) => void,
    ): void;
    removeAllListeners(channel: string): void;
  };
  webFrame: {
    insertCSS(css: string): string;
    setZoomFactor(factor: number): void;
    setZoomLevel(level: number): void;
  };
  process: {
    readonly platform: Platform;
    readonly versions: ProcessVersions;
    readonly env: Record<string, string | undefined>;
  };
}

main();
function main() {
  const preloadLogger = useLogger("preload", "#518d57");
  const mainLoader = useLogger("main", "#1f64f8");
  preloadLogger.log(`start`);
  // ...
  preloadLogger.log(`end`);
  console.log("\n\n\n");
}

function useLogger(scope: string, color: string) {
  const prefix = [
    `%c` + scope,
    `border-radius: 4px; background: ${color}; color: white; padding: 2px 6px`,
  ];

  return {
    log: (...args: any[]) => console.log(...prefix, ...args),
  };
}
