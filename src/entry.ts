import { register } from "./cli/init-cli.js";
import { Command } from "commander";

async function main() {
  const program = new Command();
  program.name("dalaikarmabot");

  await register(program);

  // Ensure help shows if no args
  if (process.argv.length <= 2) {
    program.help({ error: false });
    return;
  }

  await program.parseAsync(process.argv);
}

void main();
