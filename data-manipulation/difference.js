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

function getEventsRaw(suffix) {
    return fs.readFileSync('../data/events_raw' + suffix + '.txt', { encoding: 'utf8' });
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

function getEvents(suffix) {
    return parseEvents(getEventsRaw(suffix)).sort((a, b) => {
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

const events = getEvents('');
const events2 = getEvents('2');

function generateIndex(events) {
    var result = {};
    events.forEach((event) => {
        var key = `${event.day}__${event.hour}__${event.location}`;
        if (result[key] === undefined) {
            result[key] = [];
        }
        result[key].push(event);
    });
    return result;
}

var index = generateIndex(events);
var index2 = generateIndex(events2);

function printEvents(key, events) {
    console.log(`================= ${key} ================`);
    events.forEach((event) => {
        console.log(`${event.name}`);
    });
    console.log('==========================')
    console.log('');
}

Object.keys(index).forEach((key) => {
    if (index2[key] === undefined) {
        // console.log('MISSING IN EVENTS_RAW2');
        // printEvents(key, index[key]);
        return;
    }

    if (index2[key].length !== index[key].length) {
        console.log('Something wrong between events 1');
        printEvents(key, index[key]);
        console.log('And events 2');
        printEvents(key, index2[key]);
    }
});
