#!/usr/bin/env node

import { Command } from "commander";

const cli = new Command();
cli
  .name(`x`) //
  .description(`execute commands for the monorepo`);

getCommands().forEach((cmd) => cli.addCommand(cmd));
void cli.parseAsync(process.argv, {
  from: "node",
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import template from "../src/commands/template.js";
import ts from "../src/commands/ts.js";

function getCommands() {
  return [ts, template];
}
