import { CoreEvent } from "$/models/core.ts";
import * as z from "zod";

export const getKonpartsakEvents = async (): Promise<CoreEvent[]> => {
  const rawEvents = await getKonpartsakRawEvents();
  console.log(rawEvents.length);
  return [];
};

const getKonpartsakRawEvents = async () => {
  const actividadesData = JSON.parse(
    await Deno.readTextFile(
      "./apks/out/konpartsak/assets/www/datos/actividades.json",
    ),
  );
  const actividadesFile = ActividadesFile.parse(actividadesData);

  const konpartsakData = JSON.parse(
    await Deno.readTextFile(
      "./apks/out/konpartsak/assets/www/datos/konpartsak.json",
    ),
  );
  const konpartsakFile = KonpartsakFile.parse(konpartsakData);

  const konpartsakExpectedIds = KONPARTSAK_NAMES
    .map((n) => n.toLowerCase());
  const konpartsakIds = konpartsakFile.map((i) => i.nombre);

  for (const id of konpartsakExpectedIds) {
    const idToMatch = (() => {
      if (id === "aixe berri") return "aixe-berri";
      if (id === "abante") return "hor dago abante";
      if (id === "pa ya") return "pa...ya";
      return id;
    })();
    if (konpartsakIds.indexOf(idToMatch) === -1) {
      throw new Error(`Konpartsak '${idToMatch}' not found on file`);
    }
  }

  return actividadesFile.message;
};

const KONPARTSAK_NAMES = [
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

const KonpartsakFile = z.array(z.object({
  id: z.string().regex(/[0-9]+/),
  nombre: z.string().regex(/[a-z\-]+/),
  color: z.string().regex(/\#[0-9a-f]{6}/),
}));

const ActividadesFile = z.object({
  code: z.literal("ok"),
  message: z.array(z.object({
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
      "KAIALDE",
      "EGUZKIZALEAK",
      "BASURTO",
      "AREATZA - GASTRO",
      "ARRIAGA PLAZA",
      "ZAZPI KALEAK",
      "ETXEBARRIA PARKEA - PARQUE ETXEBARRIA",
      "EUSKAL MUSEOA - MUSEO VASCO",
      "AREATZA",
      "RIPA",
      "HPH",
      "ZABALBIDE KALEA",
      "TRIANGUNE",
      "KULTURGUNE",
      "EUSKALGUNE",
      "ZABALGUNEKO MERKATUA",
      "HONTZAK",
      "SOMERA KALEA",
      "ARRIAGAKO ATZEKALDEA",
      "PLAZA BARRIA - PLAZA NUEVA",
    ]),
    konpartsa: z.literal(""),
    tipo: z.enum([
      "GASTRONOMIA - GASTRONOMíA",
      "BAZKARIA - COMIDA",
      "LEHIAKETA - CONCURSO",
      "PIROTEKNIA - PIROTECNIA",
      "ANTZERKIA - TEATRO",
      "KIROLAK - DEPORTES",
      "JOLASAK - JUEGOS",
      "TAILERRAK - TALLERES",
      "KONTZERTUAK - CONCIERTOS",
      "MUSIKA - MúSICA",
      "DANTZAK - BAILES",
      "EKITALDIA - ACTO",
      "KALEJIRA",
      "SU ARTIFIZIALAK - FUEGOS ARTIFICIALES",
      "BESTELAKO IKUSKIZUNAK - OTROS ESPECTáCULOS",
      "BESTELAKOAK - OTROS",
      "AZOKA - MERCADO",
      "ERAKUSKETA - EXPOSICIóN",
      "BERTSOLARITZA",
    ]),
    publico: z.enum([
      "DENAK - TODOS",
      "TXIKIAK - INFANTIL",
    ]),
    id_autor: z.string().regex(/[0-9]+/),
  })),
});
