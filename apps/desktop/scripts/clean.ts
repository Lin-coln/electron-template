import fs from "fs";
import path from "node:path";
import { projectDirname } from "@scripts/utils";

void clean();

async function clean() {
  console.log(`[clean] cleaning...`);
  const targets = ["./dist", "./dist-pack"];
  await Promise.all(
    targets.map(async (target) => {
      const dirname = path.resolve(projectDirname, target);
      if (!fs.existsSync(dirname)) return;
      await fs.promises.rm(dirname, {
        recursive: true,
      });
    }),
  );
}
