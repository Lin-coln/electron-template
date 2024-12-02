import { Connect, Plugin, UserConfig, ViteDevServer } from "vite";
import { IncomingMessage, ServerResponse } from "node:http";

export interface Options<App> {
  entry: string;
  exportName?: string;
  format: "es" | "cjs";
  adapter: RequestAdapter<App>;
}

export type RequestAdapter<App> = (params: {
  app: App;
  server: ViteDevServer;
  req: IncomingMessage;
  res: ServerResponse;
  next: Connect.NextFunction;
}) => void | Promise<void>;

export default function vitePluginNode<App>(opts: Options<App>): Plugin {
  const handleRequest = opts.adapter;
  const exportName = opts.exportName ?? "default";
  const entry = opts.entry;
  return {
    name: "vite-plugin-node",
    config(cfg, env): UserConfig {
      return {
        server: { hmr: false },
        build: {
          ssr: entry,
          rollupOptions: {
            input: entry,
            output: {
              format: opts.format,
            },
          },
        },
        optimizeDeps: {
          noDiscovery: true,
          exclude: ["@swc/core"],
        },
      };
    },
    configureServer: async (server) => {
      server.middlewares.use(await createMiddleware(server));
    },
  };

  async function createMiddleware(
    server: ViteDevServer,
  ): Promise<Connect.HandleFunction> {
    const logger = server.config.logger;

    // if (opts.initAppOnBoot) {
    //   server.httpServer!.once("listening", async () => {
    //     await load();
    //   });
    // }

    return async (
      req: IncomingMessage,
      res: ServerResponse,
      next: Connect.NextFunction,
    ) => {
      const app = await load();
      if (!app) return;
      await handleRequest({ app, server, req, res, next });
    };

    async function load() {
      const appModule = await server.ssrLoadModule(entry);
      let app = appModule[exportName];
      if (!app) {
        logger.error(
          `Failed to find a named export ${exportName} from ${entry}`,
        );
        process.exit(1);
      }

      app = await app;
      return app;
    }
  }
}
