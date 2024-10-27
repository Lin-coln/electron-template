import fs from "fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const projectDirname = path.resolve(__dirname, "../..");

export async function getPackageJson() {
  const filename = path.resolve(projectDirname, "./package.json");
  if (!fs.existsSync(filename)) {
    throw new Error(`file not found: ${filename}`);
  }

  const data = await fs.promises.readFile(filename, "utf8");
  return JSON.parse(data);
}
