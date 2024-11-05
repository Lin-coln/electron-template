import process from "node:process";

process.on("SIGINT", async () => {
  await cleanUp();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await cleanUp();
  process.exit(0);
});
process.on("uncaughtException", async (error) => {
  console.error(error);
  await cleanUp();
  process.exit(1);
});

const callbacks = new Set<Function>();
async function cleanUp() {
  for (const callback of callbacks.values()) {
    await callback();
  }
}

export default function useCleanup(cb: () => unknown) {
  callbacks.add(cb);
}
