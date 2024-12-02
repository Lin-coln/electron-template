import vitePluginNode from "../vitePluginNode";
import Koa from "koa";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const rootPath = path.resolve(__dirname, "../..");

export default {
  root: rootPath,
  base: rootPath,
  plugins: [
    vitePluginNode<Koa>({
      entry: path.resolve(rootPath, "./src/index.ts"),
      format: "es",
      adapter({ app, req, res }) {
        console.log(req.url);
        app.callback()(req, res);
      },
    }),
  ],
  server: { host: "localhost", port: 3000 },
  build: {
    manifest: true,
    target: "esnext",
    outDir: path.resolve(rootPath, "dist"),
    rollupOptions: {
      external: ["fsevents"],
    },
  },
  optimizeDeps: {
    exclude: [
      "diskusage",
      "fsevents",
      // '@nestjs/microservices',
      // '@nestjs/websockets',
      // 'cache-manager',
      // 'class-transformer',
      // 'class-validator',
      // 'fastify-swagger',
    ],
  },
};
