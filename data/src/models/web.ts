import z from "zod";

const dayRegex = /^[0-9]+$/;
const dayValidator = (rawDay: string) => {
  const day = parseInt(rawDay);
  return day >= 1 && day <= 31;
};

const hourRegex = /^[0-9]{2}\:[0-9]{2}$/;
const hourValidator = (rawHour: string) => {
  const [hours, minutes] = rawHour.split(":").map((n) => parseInt(n));
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

export const WebEventSchema = z.object({
  original: z.any().nullable(),
  day: z.string().regex(dayRegex).refine(dayValidator),
  hour: z.string().regex(hourRegex).refine(hourValidator),
  location: z.string().min(1),
  name: z.string().min(1),
  name_eu: z.string().min(1),
  badges: z.array(z.string()),
}).strict();
export type WebEvent = z.infer<typeof WebEventSchema>;
