import z from "zod";
import { CommandGroupBuilder } from "denox/ui/cli/commandGroup.ts";
import { WebEventSchema } from "../models/web.ts";

const validations: [z.ZodSchema, string][] = [
  [z.array(WebEventSchema), "data.json"],
];

export const validateCommand = (cli: CommandGroupBuilder) => {
  cli
    .command("validate")
    .description("validate every json file with its corresponding schema")
    .action(async () => {
      for (const [schema, path] of validations) {
        console.log(`${path} ...`);
        const rawData = JSON.parse(await Deno.readTextFile(path));
        const result = schema.safeParse(rawData);

        if (!result.success) {
          const formatted = result.error.format();
          console.log(JSON.stringify(formatted, null, 2));
          continue;
        }
        console.log(`${path} ...OK`);
      }
    });
};
