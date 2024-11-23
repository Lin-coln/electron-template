import { context } from "@scripts/utils/config";

void main();
async function main() {
  console.log(`[pack] pack darwin application`);
  console.log(`[pack] cp resources`);
  await context.copyAsar();
  console.log(`[pack] start packing...`);
  await context.packDarwin();
  console.log(`[pack] darwin application packed`);
}
