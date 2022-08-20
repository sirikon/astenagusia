import * as z from "zod";
import { CoreEvent } from "$/models/core.ts";

const BASE_API_URL = "http://35.180.49.88/api/index.php?op=";

export const getUdalaEvents = async (): Promise<CoreEvent[]> => {
  await cacheUdalaInfo();
  const data = await getUdalaRawEvents();
  console.log(data.length);
  return [];
};

const cacheUdalaInfo = async () => {
  try {
    const rawEventsData = await fetch(
      `${BASE_API_URL}GetEgitaraua`,
    ).then((r) => r.json());
    const eventsData = RawEventsModel.parse(rawEventsData);
    eventsData.sort((a, b) => a.id - b.id);
    await Deno.writeTextFile(
      "./origins/udala_GetEgitaraua.json",
      JSON.stringify(eventsData, null, 2),
    );
  } catch (err) {
    console.log(
      "!! Udala info retrieval failed. Cached information will be used instead.",
    );
    console.log(err);
  }
};

const getUdalaRawEvents = async () => {
  const rawEventsData = JSON.parse(
    await Deno.readTextFile(
      "./origins/udala_GetEgitaraua.json",
    ),
  );
  return RawEventsModel.parse(rawEventsData);
};

const RawEventsModel = z.array(z.object({
  id: z.number(),
  date: z.string(),
  all_day: z.literal(0).nullable(),
  period: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
  ]),
  kategory_id: z.number(),
  kategory_id2: z.number().nullable(),
  organizer_eu: z.null(),
  organizer_es: z.null(),
  organizer_en: z.null(),
  organizer_fr: z.null(),
  title_eu: z.string(),
  title_es: z.string(),
  title_en: z.string(),
  title_fr: z.string(),
  konpartsak: z.union([
    z.literal(0),
    z.literal(1),
    z.null(),
  ]),
  dantzak: z.union([
    z.literal(0),
    z.literal(1),
    z.null(),
  ]),
  disabled: z.union([
    z.literal(0),
    z.literal(1),
    z.null(),
  ]),
  low_text: z.union([
    z.literal(0),
    z.literal(1),
    z.null(),
  ]),
  signs: z.union([
    z.literal(0),
    z.literal(1),
    z.null(),
  ]),
  euskaltel: z.union([
    z.literal(0),
    z.null(),
  ]),
  image: z.string().nullable(),
  pictogram_name: z.string().nullable(),
  description_eu: z.string().nullable(),
  description_es: z.string().nullable(),
  description_en: z.string().nullable(),
  description_fr: z.string().nullable(),
  place_id: z.string(),
  place_eu: z.string(),
  place_es: z.string(),
  place_en: z.string(),
  place_fr: z.string(),
  coord_lat: z.union([z.number(), z.string(), z.null()]),
  coord_lng: z.union([z.number(), z.string(), z.null()]),
  image_place: z.string().nullable(),
}));
