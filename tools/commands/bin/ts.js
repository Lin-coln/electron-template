#!/usr/bin/env node

import { Argument, Command } from "commander";
import { ts } from "@tools/api";

const cli = new Command();
cli
  .name(`ts`)
  .description(`run ts script`)
  .usage(`<target>`)
  .addArgument(arg_target())
  .action(ts);
void cli.parseAsync(process.argv, { from: "node" });
function arg_target() {
  return new Argument(`<target>`, "ts script");
}

//////////////////////////////////////////////////////////////////
