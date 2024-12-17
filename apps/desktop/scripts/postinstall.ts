import path from "path";
import { projectDirname } from "@scripts/utils";
import child_process from "node:child_process";

void main();
async function main() {
  // const pkgFilename = path.resolve(projectDirname, "package.json");
  // const pkg = await import(pkgFilename).then((m) => m.default);
  //
  // const deps = [pkg.dependencies, pkg.devDependencies]
  //   .map((deps) =>
  //     Object.entries(deps)
  //       .filter((e) => e[1] === "workspace:*")
  //       .map((e) => e[0]),
  //   )
  //   .flat(1);

  const deps = [
    path.resolve(projectDirname, "../../libraries/electron-toolkit"),
  ];

  for (const dirname of deps) {
    const pkgFilename = path.join(dirname, "package.json");
    const pkg = await import(pkgFilename).then((m) => m.default);
    const buildCommand = pkg.scripts?.build;
    if (!buildCommand) continue;

    const buildProcess = child_process.spawn("pnpm", ["run", "build"], {
      stdio: "inherit",
      cwd: dirname,
    });
    await new Promise<void>((resolve) => {
      buildProcess.once("exit", () => resolve());
    });
  }
}
