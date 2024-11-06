#!/usr/bin/env node

import { Argument, Command } from "commander";
import { ts } from "@tools/api/index.js";

const cli = new Command();
cli
  .name(`ts`)
  .description(`run ts script`)
  .usage(`<target>`)
  .addArgument(arg_target())
  .action((target) => ts(target));
void cli.parseAsync(process.argv, { from: "node" });
function arg_target() {
  return new Argument(`<target>`, "ts script");
}

//////////////////////////////////////////////////////////////////
