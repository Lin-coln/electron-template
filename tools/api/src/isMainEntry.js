import path from "node:path";
import { fileURLToPath } from "url";

export default function isMainEntry(meta) {
  const current = path.resolve(fileURLToPath(meta.url));
  const tsEntry = process.env.TS_ENTRY;

  if (tsEntry) {
    return current === tsEntry;
  } else {
    return current === path.resolve(process.argv[1]);
  }
}
