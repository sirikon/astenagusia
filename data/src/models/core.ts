import z from "zod";

export const EventLanguageSchema = z.union([
  z.literal("eu"),
  z.literal("es"),
]);
export type EventLanguage = z.infer<typeof EventLanguageSchema>;

const ManualEventInfoSchema = z.object({
  name: z.string().min(1),
});

export const ManualEventSchema = z.object({
  date: z.tuple([z.number(), z.number(), z.number()]),
  time: z.tuple([z.number(), z.number()]),
  location: z.string().min(1),
  badges: z.array(z.string()),
  info: z.object<Record<EventLanguage, typeof ManualEventInfoSchema>>({
    "es": ManualEventInfoSchema,
    "eu": ManualEventInfoSchema,
  }),
}).strict();
export type ManualEvent = z.infer<typeof ManualEventSchema>;
