import { config } from "@scripts/utils/config";
import { clean } from "@scripts/utils/toolkit";

void main();

async function main() {
  console.log(`[clean] cleaning...`);
  await clean(config);
}
