import { context } from "@scripts/utils/config";

void main();

async function main() {
  console.log(`[make] make dmg installer...`);
  await context.makeDarwin();
  console.log(`[make] done.`);
}
