import { assertEquals, assertThrows } from "std/testing/asserts.ts";
import { CoreEvent } from "../models/core.ts";
import { parseEventsMarkdown } from "./manual.ts";

Deno.test("empty document returns empty array", () => {
  verifyEventsMarkdown([""], []);
});

Deno.test("malformed document throws exceptions", () => {
  assertThrows(() =>
    verifyEventsMarkdown([
      "- 2022 08 22 - 23:30 - 🎵 - El Drogas",
    ], []), "Malformed line 1");

  assertThrows(() =>
    verifyEventsMarkdown([
      "",
      "",
      "potato",
    ], []), "Malformed line 3");
});

Deno.test("document with one entry returns single item", () => {
  verifyEventsMarkdown([
    "# Abandoibarra",
    "- 2022 08 22 - 23:30 - 🎵 - El Drogas",
    "",
  ], [
    {
      date: [2022, 8, 22],
      time: [23, 30],
      location: "Abandoibarra",
      badges: ["🎵"],
      info: {
        es: { "name": "El Drogas" },
        eu: { "name": "El Drogas" },
      },
    },
  ]);
});

Deno.test("document with many entries return multiple items", () => {
  verifyEventsMarkdown([
    "# Abandoibarra",
    "- 2022 08 22 - 23:30 - 🎵 - El Drogas",
    "- 2022 08 25 - 23:30 - 🎵 - Bulego",
    "",
    "# Parque Europa",
    "- 2022 08 24 - 00:00 - 🎵 - Ana Mena",
    "- 2022 08 26 - 00:00 - 🎵 - En Tol Sarmiento (ETS)",
    "",
  ], [
    {
      date: [2022, 8, 22],
      time: [23, 30],
      location: "Abandoibarra",
      badges: ["🎵"],
      info: {
        es: { "name": "El Drogas" },
        eu: { "name": "El Drogas" },
      },
    },
    {
      date: [2022, 8, 25],
      time: [23, 30],
      location: "Abandoibarra",
      badges: ["🎵"],
      info: {
        es: { "name": "Bulego" },
        eu: { "name": "Bulego" },
      },
    },
    {
      date: [2022, 8, 24],
      time: [0, 0],
      location: "Parque Europa",
      badges: ["🎵"],
      info: {
        es: { "name": "Ana Mena" },
        eu: { "name": "Ana Mena" },
      },
    },
    {
      date: [2022, 8, 26],
      time: [0, 0],
      location: "Parque Europa",
      badges: ["🎵"],
      info: {
        es: { "name": "En Tol Sarmiento (ETS)" },
        eu: { "name": "En Tol Sarmiento (ETS)" },
      },
    },
  ]);
});

function verifyEventsMarkdown(data: string[], result: CoreEvent[]) {
  assertEquals(parseEventsMarkdown(data.join("\n")), result);
}
