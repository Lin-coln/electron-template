import fs from "fs";
import { config } from "@scripts/utils/config";
import { getBuildDirname, getPackDirname } from "@scripts/utils/toolkit";

void clean();

async function clean() {
  console.log(`[clean] cleaning...`);
  const targets = [getBuildDirname(config), getPackDirname(config)];
  await Promise.all(
    targets.map(async (dirname) => {
      if (!fs.existsSync(dirname)) return;
      await fs.promises.rm(dirname, {
        recursive: true,
      });
    }),
  );
}
