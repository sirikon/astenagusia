'use strict';

const Event = require('./event');

function stringify(event) {
    var badgesFragment = event.badges.length === 0 ? '' : '|' + event.badges.join('-');

    var nameFragment = '';

    if (event.name === event.name_eu || !event.name_eu) {
        nameFragment = event.name;
    } else {
        nameFragment = `[${event.name}][${event.name_eu}]`;
    }

    return `${event.day}|${event.hour}|${event.location}|${nameFragment}${badgesFragment}`;
}

function parse(eventText) {
    const cells = eventText.split('|');

    var day = cells[0];
    var hour = cells[1];
    var location = cells[2];
    var name = cells[3];
    var name_eu = name;

    if (name.indexOf('[') === 0) {
        var names = name.substr(1, name.length - 2).split('][');
        name = names[0];
        name_eu = names[1];
    }

    var badges = cells.length >= 5 ? cells[4].split('-') : null;

    return new Event(day, hour, location, name, name_eu, badges);
}

module.exports = { stringify, parse };
