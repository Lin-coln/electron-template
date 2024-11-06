import process from "node:process";
import { ts } from "@tools/api";

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
  await ts("clean");
  await ts("build.main");
  await ts("build.preload");
  await ts("preview", {
    INDEX_URL: `http://localhost:5173`,
  });
}
