import { CoreEvent } from "$/models/core.ts";
import * as z from "zod";
import { konpartsakExtract } from "../../origins/konpartsak_extract.ts";

const DAY_HOUR_MAX_OVERLAP = 5;

export const getKonpartsakEvents = async (): Promise<CoreEvent[]> => {
  await validateKonpartsakNames();
  const rawEvents = await getKonpartsakRawEvents();

  return rawEvents.map((e) => ({
    info: {
      es: { name: e.nombre_es },
      eu: { name: e.nombre_eu },
    },
    badges: (() => {
      if (e.nombre_es.toLowerCase().indexOf("marijaia") >= 0) return ["🙆", "🎉"];
      if (e.nombre_es.toLowerCase().indexOf("ajedrez") >= 0) return ["♟️", "🤔"];
      if (e.tipo === "KONTZERTUAK - CONCIERTOS") return ["🎵"];
      if (e.tipo === "MUSIKA - MÚSICA") return ["🎵", "💿"];
      return [];
    })(),
    location: (() => {
      const renamedName = LUGAR_RENAME[e.lugar];
      if (renamedName != null) {
        return renamedName;
      }
      return e.lugar.split(" ").map((c) => {
        const chunk = c.toLowerCase();
        return chunk[0].toUpperCase() + chunk.substring(1);
      }).join(" ");
    })(),
    ...parseRawEventDateTime(e),
  }));
};

const parseRawEventDateTime = (
  event: ActividadesFile[0],
): Pick<CoreEvent, "date" | "time"> => {
  const [year, month, day] = event.fecha.split("-").map((n) => parseInt(n));
  const [hour, minute] = event.hora.split(":").map((n) => parseInt(n));

  return {
    date: [year, month, hour <= DAY_HOUR_MAX_OVERLAP ? day - 1 : day],
    time: [(hour <= DAY_HOUR_MAX_OVERLAP ? 24 : 0) + hour, minute],
  };
};

const getKonpartsakRawEvents = () => {
  // const actividadesData = JSON.parse(
  //   await Deno.readTextFile(
  //     "./apks/out/konpartsak/assets/www/datos/actividades.json",
  //   ),
  // );
  return ActividadesFileModel.parse(konpartsakExtract);
};

const validateKonpartsakNames = async () => {
  // const konpartsakData = JSON.parse(
  //   await Deno.readTextFile(
  //     "./apks/out/konpartsak/assets/www/datos/konpartsak.json",
  //   ),
  // );
  // const konpartsakFile = KonpartsakFileModel.parse(konpartsakData);

  // const konpartsakExpectedIds = KONPARTSAK_NAMES
  //   .map((n) => n.toLowerCase());
  // const konpartsakIds = konpartsakFile.map((i) => i.nombre);

  // for (const id of konpartsakExpectedIds) {
  //   const idToMatch = (() => {
  //     if (id === "aixe berri") return "aixe-berri";
  //     if (id === "abante") return "hor dago abante";
  //     if (id === "pa ya") return "pa...ya";
  //     return id;
  //   })();
  //   if (konpartsakIds.indexOf(idToMatch) === -1) {
  //     throw new Error(`Konpartsak '${idToMatch}' not found on file`);
  //   }
  // }
};

const LUGAR_RENAME: { [K in ActividadesFile[0]["lugar"]]?: string } = {
  "PA YA": "Pa...Ya",
  "ARRIAGA PLAZA": "Teatro Arriaga - Plaza",
  "ARRIAGAKO ATZEKALDEA": "Teatro Arriaga - Parte Trasera",
  "AREATZA": "Arenal",
  "AREATZA - GASTRO": "Arenal - Zona Gastronómica",
  "ETXEBARRIA PARKEA": "Parque Etxebarria",
  "EUSKAL MUSEOA - MUSEO VASCO": "Museo Vasco",
  "HPH": "Hau Pittu Hau!",
  "MAMIKI-TXOMIN": "Mamiki y Txomin Barullo",
  "MAMIKI-TXOMIN-ABANTE": "Mamiki, Txomin Barullo y Abante",
  "KRANBA - PIZTIAK": "Kranba y Piztiak",
  "PIZTIAK - KRANBA": "Kranba y Piztiak",
  "PLAZA BARRIA": "Plaza Nueva",
  "ZABALGUNEKO MERKATUA": "Edificio/Mercado del Ensanche",
};

const KONPARTSAK_NAMES = [
  "ASKAPEÑA",
  "ALGARA",
  "AIXE BERRI",
  "ALTXAPORRUE",
  "ABANTE",
  "KAIXO",
  "URIBARRI",
  "MOSKOTARRAK",
  "TXORI BARROTE",
  "IRRINTZI",
  "TINTIGORRI",
  "TXINBOTARRAK",
  "ZARATAS",
  "TXOMIN BARULLO",
  "KASKAGORRI",
  "KRANBA",
  "PINPILINPAUXA",
  "PIZTIAK",
  "PA YA",
] as const;

// const KonpartsakFileModel = z.array(z.object({
//   id: z.string().regex(/[0-9]+/),
//   nombre: z.string().regex(/[a-z\-]+/),
//   color: z.string().regex(/\#[0-9a-f]{6}/),
// }));

const ActividadesFileModel = z.array(z.object({
  id: z.string().regex(/[0-9]+/),
  nombre_es: z.string(),
  nombre_eu: z.string(),
  fecha: z.enum([
    "2022-08-20",
    "2022-08-21",
    "2022-08-22",
    "2022-08-23",
    "2022-08-24",
    "2022-08-25",
    "2022-08-26",
    "2022-08-27",
    "2022-08-28",
  ]),
  hora: z.string().regex(/[0-9]{2}\:[0-9]{2}\:[0-9]{2}/),
  lugar: z.enum([
    ...KONPARTSAK_NAMES,
    "MAMIKI-TXOMIN",
    "PIZTIAK - KRANBA",
    "KRANBA - PIZTIAK",
    "MAMIKI-TXOMIN-ABANTE",
    "KAIALDE",
    "EGUZKIZALEAK",
    "BASURTO",
    "ARRIAGA PLAZA",
    "ZAZPI KALEAK",
    "EUSKAL MUSEOA - MUSEO VASCO",
    "AREATZA",
    "AREATZA - GASTRO",
    "RIPA",
    "HPH",
    "ZABALBIDE KALEA",
    "TRIANGUNE",
    "KULTURGUNE",
    "EUSKALGUNE",
    "ZABALGUNEKO MERKATUA",
    "HONTZAK",
    "ITSAS MUSEOA",
    "SAN ANTON",
    "SOMERA KALEA",
    "SANTIAGO PLAZA",
    "ETXEBARRIA PARKEA",
    "BASURTU",
    "ARRIAGAKO ATZEKALDEA",
    "PLAZA BARRIA",
  ]),
  konpartsa: z.literal(""),
  tipo: z.enum([
    "GASTRONOMIA - GASTRONOMÍA",
    "BAZKARIA - COMIDA",
    "LEHIAKETA - CONCURSO",
    "PIROTEKNIA - PIROTECNIA",
    "ANTZERKIA - TEATRO",
    "KIROLAK - DEPORTES",
    "JOLASAK - JUEGOS",
    "TAILERRAK - TALLERES",
    "KONTZERTUAK - CONCIERTOS",
    "MUSIKA - MÚSICA",
    "DANTZAK - BAILES",
    "EKITALDIA - ACTO",
    "KALEJIRA",
    "SU ARTIFIZIALAK - FUEGOS ARTIFICIALES",
    "BESTELAKO IKUSKIZUNAK - OTROS ESPECTÁCULOS",
    "BESTELAKOAK - OTROS",
    "AZOKA - MERCADO",
    "ERAKUSKETA - EXPOSICIÓN",
    "BERTSOLARITZA",
  ]),
  publico: z.enum([
    "DENAK - TODOS",
    "TXIKIAK - INFANTIL",
  ]),
  id_autor: z.string().regex(/[0-9]+/),
}));
type ActividadesFile = z.infer<typeof ActividadesFileModel>;
