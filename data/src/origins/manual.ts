import z from "zod";
import { ManualEventSchema } from "../models/core.ts";

export const getManualEvents = async () => {
  const rawData = JSON.parse(await Deno.readTextFile("./origins/manual.json"));
  return z.array(ManualEventSchema).parse(rawData);
};
