const fs = require("fs");
const slugify = require("slugify");

const WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function getEvents() {
  return JSON.parse(
    fs.readFileSync("../data/data.json", { encoding: "utf-8" })
  );
}

function getDayId(dayNumber) {
  var weekDay = new Date(2019, 7, dayNumber, 12, 0, 0, 0).getDay();
  return `${WEEKDAYS[weekDay]}`;
}

function slugifyLocation(locationName) {
  return slugify(locationName)
    .replace(/\.\.\./g, "-")
    .replace(/\./g, "")
    .replace(/!/g, "")
    .toLowerCase();
}

const events = getEvents();

module.exports = {
  data() {
    return {
      home(renderLanguage) {
        var language = renderLanguage === "es" ? "es" : "eu";

        var dayIndex = {};
        var locationIndex = {};
        var dayHourIndex = {};
        var result = {
          locations: [],
          days: [],
        };

        events.forEach((event) => {
          if (!dayIndex[event.day]) {
            dayIndex[event.day] = {
              number: event.day,
              day_id: getDayId(event.day),
              locations: [],
              hours: [],
            };
            result.days.push(dayIndex[event.day]);
          }
          var day = dayIndex[event.day];
          var dayHourKey = `${event.day}_${event.hour}`;
          if (!dayHourIndex[dayHourKey]) {
            dayHourIndex[dayHourKey] = {
              text: event.hour,
              locations: [],
              events: [],
            };
            day.hours.push(dayHourIndex[dayHourKey]);
          }
          var hour = dayHourIndex[dayHourKey];
          var locationSlug = slugifyLocation(event.location);
          if (hour.locations.indexOf(locationSlug) === -1) {
            hour.locations.push(locationSlug);
          }
          if (day.locations.indexOf(locationSlug) === -1) {
            day.locations.push(locationSlug);
          }
          if (!locationIndex[locationSlug]) {
            locationIndex[locationSlug] = {
              name: event.location,
              slug: locationSlug,
            };
            result.locations.push(locationIndex[locationSlug]);
          }
          hour.events.push({
            location: {
              name: event.location,
              slug: locationSlug,
            },
            name: event["name_" + language] || event.name,
            badges: event.badges,
          });
        });

        result.locations = result.locations.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        return result;
      },
    };
  },
};
