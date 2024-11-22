import { build } from "tsup";
import { isMainEntry } from "@tools/api";
import { config } from "@scripts/utils/config";
import { createMainTsupOptions } from "@scripts/utils/toolkit";

if (isMainEntry(import.meta)) {
  // ...
}

void main();
async function main() {
  const watch = (process.env.WATCH_MAIN ?? "false") === "true";

  console.log(`[build:main] compiling`);
  const opts = createMainTsupOptions(config);
  await build({ ...opts, watch });
}
