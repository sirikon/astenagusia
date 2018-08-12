const fs = require('fs');
const path = require('path');
const slugify = require('slugify');

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

class Event {
    constructor(day, hour, location, name, badges) {
        this.day = day;
        this.hour = hour;
        this.location = location;
        this.name = name;
        this.badges = badges;
    }
}

function getEventsRaw() {
    return fs.readFileSync(path.join(__dirname, './events_raw.txt'), { encoding: 'utf8' });
}

function parseEvents(text) {
    var result = [];
    text = text.replace('\r', '');
    var lines = text.split('\n');
    lines.forEach((line) => {
        line = line.trim();
        if (line === '') return;
        var cells = line.split('|');
        result.push(new Event(cells[0], cells[1], cells[2], cells[3], (cells.length >= 5 ? cells[4].split('-') : null)));
    });
    return result;
}

function getHourInfo(hourText) {
    var chunks = hourText.split(':');
    var hours = parseInt(chunks[0]);
    var minutes = parseInt(chunks[1]);

    var hoursForSortValue = (hours - 6 + 24) % 24;

    return {
        hours,
        minutes,
        sortValue: ((hoursForSortValue * 60) + minutes)
    }
}

function getEvents() {
    return parseEvents(getEventsRaw()).sort((a, b) => {
        if (a.day < b.day) {
            return -1;
        }
        if (a.day > b.day) {
            return 1;
        }

        var aHourSortValue = getHourInfo(a.hour).sortValue;
        var bHourSortValue = getHourInfo(b.hour).sortValue;

        if (aHourSortValue < bHourSortValue) {
            return -1;
        }
        if (aHourSortValue > bHourSortValue) {
            return 1;
        }

        if (a.location < b.location) {
            return -1;
        }
        if (a.location > b.location) {
            return 1;
        }

        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }

        return 0;
    })
}

const events = getEvents();

function getDayId(dayNumber) {
    var weekDay = (new Date(2018, 7, dayNumber, 12, 0, 0, 0)).getDay();
    return `${WEEKDAYS[weekDay]}`;
}

function slugifyLocation(locationName) {
    return slugify(locationName)
        .replace(/\.\.\./g, '-')
        .replace(/\./g, '')
        .replace(/\!/g, '')
        .toLowerCase();
}

module.exports = {
    get data() {
        return {
            get home() {
                var dayIndex = {};
                var locationIndex = {};
                var dayHourIndex = {};
                var result = {
                    locations: [],
                    days: []
                };

                events.forEach((event) => {
                    if (!dayIndex[event.day]) {
                        dayIndex[event.day] = {
                            number: event.day,
                            day_id: getDayId(event.day),
                            locations: [],
                            hours: []
                        };
                        result.days.push(dayIndex[event.day]);
                    }
                    var day = dayIndex[event.day];
                    var dayHourKey = `${event.day}_${event.hour}`;
                    if (!dayHourIndex[dayHourKey]) {
                        dayHourIndex[dayHourKey] = {
                            text: event.hour,
                            locations: [],
                            events: []
                        }
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
                            slug: locationSlug
                        }
                        result.locations.push(locationIndex[locationSlug]);
                    }
                    hour.events.push({
                        location: {
                            name: event.location,
                            slug: locationSlug
                        },
                        name: event.name,
                        badges: event.badges
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
                })
                
                return result;
            }
        }
    }
}
