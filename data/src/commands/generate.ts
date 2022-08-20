import { CommandGroupBuilder } from "denox/ui/cli/commandGroup.ts";
import { CoreEvent } from "$/models/core.ts";
import { WebEvent } from "$/models/web.ts";
import { getKonpartsakEvents } from "$/origins/konpartsak.ts";
import { getManualEvents } from "$/origins/manual.ts";
import { getUdalaEvents } from "$/origins/udala.ts";

export const generateCommand = (cli: CommandGroupBuilder) => {
  cli
    .command("generate")
    .description("generate data.json")
    .action(async () => {
      const events = [
        ...await getUdalaEvents(),
        ...await getKonpartsakEvents(),
        ...await getManualEvents(),
      ];

      events.sort((a, b) => {
        if (a.date[0] !== b.date[0]) return a.date[0] - b.date[0];
        if (a.date[1] !== b.date[1]) return a.date[1] - b.date[1];
        if (a.date[2] !== b.date[2]) return a.date[2] - b.date[2];
        if (a.time[0] !== b.time[0]) return a.time[0] - b.time[0];
        if (a.time[1] !== b.time[1]) return a.time[1] - b.time[1];
        if (a.location !== b.location) return a.location > b.location ? 1 : -1;
        return 0;
      });

      const result = events.map((e): WebEvent => ({
        name: e.info.es.name,
        name_eu: e.info.eu.name,
        year: e.date[0],
        month: e.date[1],
        day: e.date[2].toString(),
        hour: hourForWebEvent(e.time),
        badges: e.badges,
        location: e.location,
      }));

      await Deno.writeTextFile("./data.json", JSON.stringify(result, null, 2));
    });
};

const hourForWebEvent = (time: CoreEvent["time"]) => {
  const [hour, minute] = time;
  return [
    (hour % 24).toString().padStart(2, "0"),
    minute.toString().padStart(2, "0"),
  ].join(":");
};
