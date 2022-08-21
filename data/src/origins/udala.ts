import * as z from "zod";
import { CoreEvent } from "$/models/core.ts";

const BASE_API_URL = "http://35.180.49.88/api/index.php?op=";
const DAY_HOUR_MAX_OVERLAP = 5;

export const getUdalaEvents = async (): Promise<CoreEvent[]> => {
  await cacheUdalaInfo();
  const udalaEvents = await getUdalaRawEvents();

  return udalaEvents
    .filter((e) => {
      if (PLACE_WHITELIST.includes(e.place_id)) return true;
      if (PICTOGRAM_WHITELIST.includes(e.pictogram_name)) return true;
      return false;
    })
    .map((e) => ({
      info: {
        es: {
          name: EVENT_RETITLE[e.title_es] != null
            ? EVENT_RETITLE[e.title_es]
            : normalizeTitle(
              e.title_es + (e.description_es ? `: ${e.description_es}` : ""),
            ),
        },
        eu: {
          name: EVENT_RETITLE[e.title_eu] != null
            ? EVENT_RETITLE[e.title_eu]
            : normalizeTitle(
              e.title_eu + (e.description_eu ? `. ${e.description_eu}` : ""),
            ),
        },
      },
      badges: (() => {
        if (e.pictogram_name === "concierto.jpg") return ["🎵", "🎤"];
        if (e.pictogram_name === "musica_dj.jpg") return ["🎵", "💿"];
        if (e.pictogram_name === "musica_lirico.jpg") return ["🎵", "🎻"];
        if (e.pictogram_name === "teatro_calle.jpg") return ["🎭"];
        if (e.pictogram_name === "teatro_infantil.jpg") return ["🎭", "🧒"];
        return [];
      })(),
      location: PLACE_NAMES[e.place_id]!,
      ...parseRawEventDateTime(e),
    }));
};

const PLACE_WHITELIST: RawEvents[0]["place_id"][] = [
  "abandoibarra",
  "pergola",
  "bilborock_aretoa",
  "gizakunde_eliza",
];

const PICTOGRAM_WHITELIST: RawEvents[0]["pictogram_name"][] = [
  "teatro_calle.jpg",
  "teatro_infantil.jpg",
];

const EVENT_RETITLE: { [K: string]: string } = {
  "MIKEL URDANGARIN  + BOS ":
    "Mikel Urdangarin + Bilboko Orkestra Sinfonikoa (BOS)",
};

const PLACE_NAMES: { [K in RawEvents[0]["place_id"]]: string } = {
  abandoibarra: "Abandoibarra",
  areatza: "Arenal",
  areatzako_kioskoa: "Arenal - Kiosko",
  arriaga_antzoki: "Teatro Arriaga",
  arriaga_plaza: "Teatro Arriaga - Plaza",
  basurtu_ospitala: "Hospital de Basurto",
  bilborock_aretoa: "Bilborock",
  casilda_parkea: "Parque de Doña Casilda",
  pergola: "Parque de Doña Casilda - Pérgola",
  europa_parkea: "Parque Europa",
  euskal_museoa: "Museo Vasco",
  gas_plaza: "Plaza del Gas",
  gizakunde_eliza: "Iglesia de la Encarnación",
  gran_via: "Gran Vía",
  kaialde: "Muelle de Ripa",
  ripa: "Muelle de Ripa",
  kalez_kale: "Por las calles",
  kontsulatuaren_plazatxoa: "Plazuela del Consulado",
  plaza_barria: "Plaza Nueva",
  plaza_biribila: "Plaza Circular",
  ria_bilbao: "Ría de Bilbao",
  bilbao: "Bilbao",
  somera: "Calle Somera",
  santiago_plaza: "Plaza de la Catedral de Santiago",
  karpagune: "Karpagune (Entre el Teatro Arriaga y la ría)",
  triangune: "Triangune (Junto a la Fuente del Arenal)",
  zabalbide_kalea: "Calle Zabalbide",
  zabalgune_eraikina: "Edificio del Ensanche",
  zazpi_kaleak: "Zazpi Kaleak",
  zezen_plaza: "Plaza de Toros",
  txos_abante: "Abante",
  txos_hontzak: "Hontzak",
  txos_moskotarrak: "Moskotarrak",
  txos_tintigorri: "Tintigorri",
};

const parseRawEventDateTime = (
  event: RawEvents[0],
): Pick<CoreEvent, "date" | "time"> => {
  const [fecha, hora] = event.date.split(" ");
  const [year, month, day] = fecha.split("/").map((n) => parseInt(n));
  const [hour, minute] = hora.split(":").map((n) => parseInt(n));

  return {
    date: [year, month, day],
    time: [(hour <= DAY_HOUR_MAX_OVERLAP ? 24 : 0) + hour, minute],
  };
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

const normalizeTitle = (text: string) => {
  try {
    return text.split(" ")
      .map((word) => {
        if (word === "") return word;
        if (word.toLowerCase() === "de") return "de";
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
      })
      .join(" ")
      .replace(/\ +/, " ");
  } catch (err: unknown) {
    throw new Error(`Normalization failed for '${text}'`, {
      cause: err instanceof Error ? err : undefined,
    });
  }
};

const RawEventsModel = z.array(z.object({
  id: z.number(),
  date: z.string().regex(/^2022\/08\/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/),
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
  pictogram_name: z.enum([
    "concierto.jpg",
    "bilbainadas.jpg",
    "gigantes_y_cabezudos.jpg",
    "txistularis.jpg",
    "bertsolaris.jpg",
    "concurso.jpg",
    "teatro_calle.jpg",
    "teatro_infantil.jpg",
    "toro_de_fuego.jpg",
    "inscripcion.jpg",
    "banda_municipal.jpg",
    "musica_dj.jpg",
    "musica_lirico.jpg",
    "hiri_krosa.jpg",
    "cocina.jpg",
    "ajedrez.jpg",
    "baloncesto.jpg",
    "txupinazo.jpg",
    "toros.jpg",
    "verbena.jpg",
    "fuegos_artificiales.jpg",
  ]).nullable(),
  description_eu: z.string().nullable(),
  description_es: z.string().nullable(),
  description_en: z.string().nullable(),
  description_fr: z.string().nullable(),
  place_id: z.enum([
    "abandoibarra",
    "europa_parkea",
    "plaza_barria",
    "pergola",
    "arriaga_plaza",
    "zezen_plaza",
    "gas_plaza",
    "santiago_plaza",
    "zazpi_kaleak",
    "ria_bilbao",
    "casilda_parkea",
    "plaza_biribila",
    "gizakunde_eliza",
    "areatzako_kioskoa",
    "bilborock_aretoa",
    "areatza",
    "kontsulatuaren_plazatxoa",
    "zabalbide_kalea",
    "triangune",
    "kalez_kale",
    "euskal_museoa",
    "zabalgune_eraikina",
    "arriaga_antzoki",
    "somera",
    "karpagune",
    "basurtu_ospitala",
    "ripa",
    "gran_via",
    "kaialde",
    "bilbao",
    "txos_hontzak",
    "txos_moskotarrak",
    "txos_abante",
    "txos_tintigorri",
  ]),
  place_eu: z.string(),
  place_es: z.string(),
  place_en: z.string(),
  place_fr: z.string(),
  coord_lat: z.union([z.number(), z.string(), z.null()]),
  coord_lng: z.union([z.number(), z.string(), z.null()]),
  image_place: z.string().nullable(),
}));
type RawEvents = z.infer<typeof RawEventsModel>;
