const fs = require('fs');
const path = require('path');

const DAY_START_HOUR = 5;
const HOUR_SORT_VALUE_ADJUST = -(DAY_START_HOUR * 60);

class Event {
    constructor(day, hour, location, name) {
        this.day = day;
        this.hour = hour;
        this.location = location;
        this.name = name;
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
        result.push(new Event(cells[0], cells[1], cells[2], cells[3]));
    });
    return result;
}

function getHourInfo(hourText) {
    var chunks = hourText.split(':');
    var hours = parseInt(chunks[0]);
    var minutes = parseInt(chunks[1]);

    return {
        hours,
        minutes,
        sortValue: ((hours * 60) + minutes)
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

        return 0;
    })
}

const events = getEvents();

module.exports = {
    get data() {
        return {
            get home() {
                var dayIndex = {};
                var dayHourIndex = {};
                var result = {
                    days: []
                };

                events.forEach((event) => {
                    if (!dayIndex[event.day]) {
                        dayIndex[event.day] = {
                            number: event.day,
                            hours: []
                        };
                        result.days.push(dayIndex[event.day]);
                    }
                    var day = dayIndex[event.day];
                    var dayHourKey = `${event.day}_${event.hour}`;
                    if (!dayHourIndex[dayHourKey]) {
                        dayHourIndex[dayHourKey] = {
                            text: event.hour,
                            events: []
                        }
                        day.hours.push(dayHourIndex[dayHourKey]);
                    }
                    var hour = dayHourIndex[dayHourKey];
                    hour.events.push({
                        location: event.location,
                        name: event.name
                    });
                });
                
                return result;
            }
        }
    }
}
