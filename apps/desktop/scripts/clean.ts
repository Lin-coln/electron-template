import fs from "fs";
import path from "node:path";
import { projectDirname } from "@scripts/utils";
import { DIST, DIST_PACK } from "@scripts/utils/constant";

void clean();

async function clean() {
  console.log(`[clean] cleaning...`);
  const targets = [DIST, DIST_PACK];
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
