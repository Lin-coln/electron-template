import { createServer } from "vite";
import config from "./utils/config.ts";

void main();
async function main() {
  const server = await createServer(config);
  await server.listen();
  server.printUrls();
  server.bindCLIShortcuts({ print: true });
}
