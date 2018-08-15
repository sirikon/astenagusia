'use strict';

const Event = require('./event');

function stringify(event) {
    return `${event.day}|${event.hour}|${event.location}|${event.name}${(event.badges.length === 0 ? '' : '|' + event.badges.join('-'))}`;
}

function parse(eventText) {
    const cells = eventText.split('|');

    return new Event(
        cells[0],
        cells[1],
        cells[2],
        cells[3],
        cells.length >= 5 ? cells[4].split('-') : null
    );
}

module.exports = { stringify, parse };