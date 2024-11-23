import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectDirname = path.resolve(__dirname, "../..");

export function debounce<Fn extends (...args: any[]) => void>(
  fn: Fn,
  time: number,
): Fn {
  let timer: any = null;
  const res = (...args: any[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      timer && clearTimeout(timer);
      fn(...args);
    }, time);
  };
  return res as any;
}
