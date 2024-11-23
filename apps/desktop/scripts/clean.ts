import { context } from "@scripts/utils/config";

void main();

async function main() {
  console.log(`[clean] cleaning...`);
  await context.cleanup();
}
