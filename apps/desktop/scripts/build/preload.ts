import { build } from "tsup";
import { config } from "@scripts/utils/config";
import { createPreloadTsupOptions } from "@scripts/utils/toolkit";

void main();
async function main() {
  const watch = (process.env.WATCH_PRELOAD ?? "false") === "true";

  console.log(`[build:preload] compiling`);
  const opts = createPreloadTsupOptions(config);
  await build({ ...opts, watch: watch });
}
