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
    return fs.readFileSync('../data/events_raw_old.txt', { encoding: 'utf8' });
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

const ALLOWED_PLACES = [
    'zuloa',
    'la carbonería',
    'shake!',
    'nave 9',
    'kafe antzokia',
    'ambigú',
    'abandoibarra',
    'parque europa',
    'plaza nueva',
    'bilborock'
]

const events = getEvents()
    .filter((event) => {
        if (ALLOWED_PLACES.indexOf(event.location.toLowerCase()) >= 0) {
            return true;
        }
        return false;
    })

events.forEach((event) => {
    console.log(`${event.day}|${event.hour}|${event.location}|${event.name}${(event.badges ? `|${(event.badges.join('-'))}` : '')}`)
});
