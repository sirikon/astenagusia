import z from "zod";
import { cli, run } from "denox/ui/cli/mod.ts";
import { WebEventSchema } from "./models/web.ts";

const dataCli = cli("astenagusia-data");

dataCli
  .command("validate")
  .description("Validates data.json file")
  .action(async () => {
    const rawData = JSON.parse(await Deno.readTextFile("./data.json"));
    const data = z.array(WebEventSchema).parse(rawData);
    console.log("Validation successful");
    console.log("Event count: ", data.length);
  });

run(dataCli);
