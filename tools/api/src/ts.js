import child_process from "node:child_process";
import path from "node:path";
import fs from "fs";

export default main;

async function main(target, env = {}) {
  const projectDirname = await resolveProjectDirname();

  let filename;
  if (path.isAbsolute(target)) {
    filename = target;
  } else {
    filename = await resolveScriptFilename(target);
  }

  const tsconfig = await resolveTsConfig();
  await runScript({ filename, tsconfig, env });

  async function resolveScriptFilename(target) {
    const targets =
      path.extname(target) === ".ts"
        ? [target]
        : [`${target}/index.ts`, `${target}.ts`];
    const filenames = targets
      .map((target) => [
        path.resolve(projectDirname, target),
        path.resolve(projectDirname, "scripts", target),
        path.resolve(process.cwd(), target),
      ])
      .flat(1);
    return filenames.find((x) => fs.existsSync(x));
  }
  async function resolveTsConfig() {
    return [
      path.resolve(projectDirname, `./scripts/tsconfig.json`),
      path.resolve(projectDirname, `./tsconfig.json`),
    ].find((x) => fs.existsSync(x));
  }
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

async function runScript({ filename, tsconfig, env }) {
  await new Promise((resolve) => {
    child_process.execSync(`tsx --tsconfig ${tsconfig} ${filename}`, {
      stdio: "inherit",
      env: {
        ...process.env,
        ...env,
      },
    });
    resolve();
  });
}
