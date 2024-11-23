import { build } from "tsup";
import { context } from "@scripts/utils/config";

void main();
async function main() {
  const watch = (process.env.WATCH_PRELOAD ?? "false") === "true";
  console.log(`[build:preload] compiling`);
  const opts = context.createPreloadTsupOptions();
  await build({ ...opts, watch: watch });
}
