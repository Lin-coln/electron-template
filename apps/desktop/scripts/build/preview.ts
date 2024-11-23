import { context } from "@scripts/utils/config";

void main();
async function main() {
  await context.spawnElectronProcess({});
}
