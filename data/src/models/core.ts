export type EventLanguage = "eu" | "es";

export type CoreEvent = {
  date: [number, number, number];
  time: [number, number];
  location: string;
  badges: string[];
  info: Record<EventLanguage, CoreEventInfo>;
};

export type CoreEventInfo = {
  name: string;
};
