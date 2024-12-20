import child_process from "node:child_process";
import path from "node:path";
import fs from "fs";

export default main;

async function main(target, env = {}) {
  let filename;
  if (path.isAbsolute(target)) {
    filename = target;
  } else {
    filename = await resolveScriptFilename(target);
  }

  const tsconfig = await resolveTsConfig();
  await runScript({ filename, tsconfig, env });
}

async function resolveProjectDirname() {
  let dirname = process.cwd();
  while (true) {
    if (fs.existsSync(path.resolve(dirname, "package.json"))) {
      return dirname;
    }
    dirname = path.resolve(dirname, "..");
  }
}

async function resolveScriptFilename(target) {
  const projectDirname = await resolveProjectDirname();
  const targets =
    path.extname(target) === ".ts"
      ? [target]
      : [`${target}/index.ts`, `${target}.ts`];
  const dirs = Array.from(
    new Set([
      path.resolve(projectDirname, "scripts"),
      projectDirname,
      process.cwd(),
    ]),
  );
  const filenames = dirs
    .map((dir) => targets.map((tar) => path.resolve(dir, tar)))
    .flat(1);
  return filenames.find((x) => fs.existsSync(x));
}

async function resolveTsConfig() {
  const projectDirname = await resolveProjectDirname();
  return [
    path.resolve(projectDirname, `./scripts/tsconfig.json`),
    path.resolve(projectDirname, `./tsconfig.json`),
  ].find((x) => fs.existsSync(x));
}

async function runScript({ filename, tsconfig, env }) {
  await new Promise((resolve, reject) => {
    process.env.TS_ENTRY ??= filename;
    const cmd = `tsx --tsconfig ${tsconfig} ${filename}`;
    env = Object.fromEntries(
      Object.entries(env)
        .filter(([_, value]) => ![undefined, ""].includes(value))
        .map(([key, value]) => [key, value.toString()]),
    );
    const [command, ...args] = cmd.split(" ");
    const childProcess = child_process.spawn(command, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ...env,
      },
    });
    childProcess.on("error", (err) => {
      reject(err);
    });
    childProcess.on("close", () => {
      resolve();
    });
  });
}
