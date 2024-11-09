import process from "node:process";
import { ts } from "@tools/api";
import { generatePackageJson } from "@scripts/utils/generatePackageJson";

void main().then(
  () => {
    process.exit(0);
  },
  (reason) => {
    console.error(reason);
    process.exit(1);
  },
);

async function main() {
  await generatePackageJson();
  await ts("build/preview", {
    INDEX_URL: `http://localhost:5173`,
  });
}
