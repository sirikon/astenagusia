import { cli, run } from "denox/ui/cli/mod.ts";
import { generateCommand } from "./commands/generate.ts";
import { validateCommand } from "./commands/validate.ts";

const dataCli = cli("astenagusia-data");

validateCommand(dataCli);
generateCommand(dataCli);

run(dataCli);
