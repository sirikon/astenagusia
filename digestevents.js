const fs = require('fs');

var currentEvents = JSON.parse(fs.readFileSync('./data/events.json', { encoding: 'utf8' }));
var newEventsRaw = fs.readFileSync('./events.txt', { encoding: 'utf8' });

function parseRawEvents(text) {
    var lines = text.split('\n');
    return lines.map(parseRawEvent);
}

function parseRawEvent(line) {
    var cells = line.split('|');
    return {
        day: parseInt(cells[0]),
        hour: cells[1],
        location: cells[2],
        name: cells[3]
    }
}

function addEventsToCurrentEvents(newEvents, currentEvents) {
    newEvents.forEach((event) => {
        Object.keys(currentEvents).forEach((key) => {
            if (currentEvents[key].day === event.day) {
                if (currentEvents[key].events[event.hour] === undefined) {
                    currentEvents[key].events[event.hour] = [];
                }
                currentEvents[key].events[event.hour].push({
                    name: event.name,
                    location: event.location
                });
            }
        })
    })
}

function sortHours(currentEvents) {
    
}

addEventsToCurrentEvents(parseRawEvents(newEventsRaw), currentEvents);
sortHours(currentEvents);

console.log(JSON.stringify(currentEvents, null, 2));
