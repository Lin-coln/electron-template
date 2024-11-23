import { build } from "tsup";
import { isMainEntry } from "@tools/api";
import { context } from "@scripts/utils/config";

if (isMainEntry(import.meta)) {
  // ...
}

void main();
async function main() {
  const watch = (process.env.WATCH_MAIN ?? "false") === "true";
  console.log(`[build:main] compiling`);
  const opts = context.createMainTsupOptions();
  await build({ ...opts, watch });
}
