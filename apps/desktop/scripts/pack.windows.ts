import { context } from "@scripts/utils/config";

void main();
async function main() {
  console.log(`[pack.windows] start packing...`);
  await context.packWindows();
  console.log(`[pack.windows] application packed`);
}
