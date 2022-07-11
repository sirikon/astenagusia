import { CommandGroupBuilder } from "denox/ui/cli/commandGroup.ts";
import { WebEvent } from "../models/web.ts";
import { getManualEvents } from "../origins/manual.ts";

export const generateCommand = (cli: CommandGroupBuilder) => {
  cli
    .command("generate")
    .description("generate data.json")
    .action(async () => {
      const manualEvents = await getManualEvents();

      const result = manualEvents.map((e): WebEvent => ({
        name: e.info.es.name,
        name_eu: e.info.eu.name,
        day: e.date[2].toString(),
        hour: e.time.map((i) => i.toString().padStart(2, "0")).join(":"),
        badges: e.badges,
        location: e.location,
      }));

      await Deno.writeTextFile("./data.json", JSON.stringify(result, null, 2));
    });
};
