import { assertEquals } from "std/testing/asserts.ts";
import { normalizeTitle } from "$/origins/konpartsak.ts";

Deno.test("Normalize Title", () => {
  verify("", "");
  verify("hello", "hello");
  verify("InscrÍpciÓn", "Inscrípción");
  verify("INSCRIPCIÓN", "INSCRIPCIÓN");
  verify("Ábcd", "Ábcd");
  verify("Cosa Ósea", "Cosa Ósea");
  verify("DÍa bonito", "Día bonito");
});

const verify = (input: string, output: string) => {
  assertEquals(normalizeTitle(input), output);
};
