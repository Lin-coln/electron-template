import fs from "fs";
import path from "node:path";
import { projectDirname } from "@scripts/utils";

void clean();

async function clean() {
  console.log(`[clean] cleaning...`);
  const dirname = path.resolve(projectDirname, "./dist");
  if (!fs.existsSync(dirname)) return;
  await fs.promises.rm(dirname, {
    recursive: true,
  });
}
