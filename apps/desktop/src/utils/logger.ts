export const logger = {
  queue: [] as { args: any[] }[],
  log(...args: any[]) {
    console.log(...args);
    this.queue.push({ args });
  },
};
