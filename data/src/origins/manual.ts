import { CoreEvent } from "../models/core.ts";

export const getManualEvents = async () => {
  const content = await Deno.readTextFile("./origins/manual.md");
  return parseEventsMarkdown(content);
};

export function parseEventsMarkdown(content: string): CoreEvent[] {
  const lines = content.split("\n");

  let currentLocation: string | null = null;
  const result: CoreEvent[] = [];

  for (const [i, line] of lines.entries()) {
    if (line.startsWith("# ")) {
      currentLocation = line.substring("# ".length);
      continue;
    }

    if (line.startsWith("- ")) {
      if (currentLocation == null) {
        throw new Error("Malformed line " + (i + 1));
      }
      const [
        date,
        time,
        badgesData,
        nameData,
      ] = line.substring("- ".length).split(" - ");
      const [year, month, day] = date.split(" ").map((n) => parseInt(n));
      const [hour, minute] = time.split(":").map((n) => parseInt(n));
      const badges = badgesData.split(",");
      const name = nameData;
      result.push({
        location: currentLocation,
        info: {
          es: { name },
          eu: { name },
        },
        badges,
        date: [year, month, day],
        time: [hour, minute],
      });
      continue;
    }

    if (line === "") {
      continue;
    }

    throw new Error("Malformed line " + (i + 1));
  }

  return result;
}
