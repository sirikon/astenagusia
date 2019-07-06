'use strict';

const fs = require('fs');

const Event = require('../../../lib/event');
const eventWriter = require('../../../lib/eventWriter');

var rawEvents = JSON.parse(fs.readFileSync('../../../crawler/eitb-versions/current.json'));

var events = [];

const locationReplacements = {
    'Arriaga plaza': 'Arriaga Plaza',
    'Arriagako Atz': 'Arriagako Atz.',
    'Arriagako atz.': 'Arriagako Atz.',
    'Etxebarria parkea': 'Etxebarria Parkea',
    'Irrintz': 'Irrintzi',
    'Somera kalea': 'Somera Kalea',
    'Konsuletxearen pl.': 'Konsuletxearen Pl.',
    'Abante': 'Abante!',
    'Aixeberri': 'Aixe Berri',
    'Gas plaza': 'Gas Plaza',
    'Pa…Ya!': 'Pa...Ya!',
    'Pa... Ya!': 'Pa...Ya!',
    'Plaza Barria': 'Plaza Nueva',
    'Plaza Barria - Plaza Nueva': 'Plaza Nueva',
    'Santiago plaza': 'Santiago Plaza',
    'Txomin B.': 'Txomin Barullo',
    'Zabalbide kalea': 'Zabalbide Kalea',
    'Zazpi Kaleak:': 'Zazpi Kaleak',
    'De Sestao al Ayuntamiento': 'Sestaotik Udaletxera'
};

function fixLocation(location) {
    if (locationReplacements[location]) {
        return locationReplacements[location];
    }
    return location;
}

function involvedLocations(locationText) {
    if (locationText.indexOf (' + ') >= 0) {
        var halfs = locationText.split(' + ');
        return halfs.map(fixLocation);
    }

    if (locationText.indexOf (' - ') >= 0) {
        var halfs = locationText.split(' - ');
        return halfs.map(fixLocation);
    }

    return [fixLocation(locationText)];
}

Object.keys(rawEvents).forEach((key) => {
    var dayObj = rawEvents[key];
    
    var day = dayObj.day;

    Object.keys(dayObj.events).forEach((key) => {
        var hourObj = dayObj.events[key];

        var hour = key;

        hourObj.forEach((event) => {
            var name = event.name;

            var locations = involvedLocations(event.location);

            var thisHour = hour;

            if (name === 'Agurra a Marijaia') {
                thisHour = '19:45';
            }

            locations.forEach((location) => {
                events.push(new Event(day, thisHour, location, name));
            });
        });
    });
});

eventWriter.writeStdout(events);
