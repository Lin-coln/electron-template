import { context } from "@scripts/utils/config";

void main();
async function main() {
  console.log(`[pack.darwin] start packing...`);
  await context.packDarwin();
  console.log(`[pack.darwin] application packed`);
}
