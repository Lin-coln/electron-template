import { Argument, Command } from "commander";
import { ts } from "@tools/api";

export default new Command("ts")
  .description(`run ts script`)
  .usage(`<target>`)
  .addArgument(arg_target())
  .action((target) => ts(target));

function arg_target() {
  return new Argument(`<target>`, "ts script");
}

//////////////////////////////////////////////////////////////////
