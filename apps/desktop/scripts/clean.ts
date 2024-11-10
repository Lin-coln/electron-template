import fs from "fs";
import path from "node:path";
import { config } from "@scripts/utils/config";

void clean();

async function clean() {
  console.log(`[clean] cleaning...`);
  const targets = [config.dist.build, config.dist.pack];
  await Promise.all(
    targets.map(async (target) => {
      const dirname = path.resolve(config.base, target);
      if (!fs.existsSync(dirname)) return;
      await fs.promises.rm(dirname, {
        recursive: true,
      });
    }),
  );
}
