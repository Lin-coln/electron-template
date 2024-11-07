import { Argument, Command, InvalidArgumentError } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { projectDirname, repoDirname, updateJsonFile } from "../utils/index.js";

const templateRoot = path.resolve(projectDirname, "./templates");

export default new Command("template")
  .description(`create template`)
  .usage(`<type> <package-name>`)
  .addArgument(arg_type())
  .addArgument(arg_name())
  .action(handleCreateTemplate);

function arg_type() {
  const templates = fs.readdirSync(templateRoot);

  return new Argument(`<type>`, "template type")
    .choices(templates)
    .argParser((name) => {
      const templatePathname = path.resolve(templateRoot, name);
      if (!fs.existsSync(templatePathname)) {
        throw new InvalidArgumentError(
          `template is not existed: ${templatePathname}`,
        );
      }
      return {
        name,
        dirname: templatePathname,
      };
    });
}
function arg_name() {
  return new Argument(`<package-name>`, "package name");
}

//////////////////////////////////////////////////////////////////

async function handleCreateTemplate(template, packageName) {
  // ...
  let targetRoot = "libraries";
  const targetRoots = {
    libraries: ["lib-ts"],
  };
  targetRoot =
    Object.entries(targetRoots).find(([root, types]) =>
      types.includes(template.name),
    )?.[0] ?? targetRoot;

  const targetDirname = path.resolve(repoDirname, targetRoot, packageName);

  if (fs.existsSync(targetDirname)) {
    throw new Error(`failed to create template: ${targetDirname}`);
  }

  console.log(`[template] `, {
    name: packageName,
    type: template.name,
    dist: path.relative(repoDirname, targetDirname),
  });

  await fs.promises.mkdir(targetDirname);

  const files = await fs.promises.readdir(template.dirname, {
    recursive: true,
  });

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const templateFilename = path.resolve(template.dirname, file);
    const targetFilename = path.resolve(targetDirname, file);
    await fs.promises.cp(templateFilename, targetFilename, { recursive: true });
  }

  await updateJsonFile(path.resolve(targetDirname, "package.json"), (data) => {
    data.name = data.name.replace(`$name`, packageName);
  });
}
