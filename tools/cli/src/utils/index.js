import url from "url";
import path from "node:path";
import fs from "node:fs";

export const projectDirname = path.resolve(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../..",
);

export const repoDirname = path.resolve(projectDirname, "../..");

export const updateJsonFile = async (filename, callback) => {
  const dataString = await fs.promises.readFile(filename, "utf8");
  const data = JSON.parse(dataString);
  const result = await callback(data);
  await fs.promises.writeFile(
    filename,
    JSON.stringify(result ?? data, null, 2),
    "utf8",
  );
};
