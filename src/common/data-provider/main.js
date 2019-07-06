const eventReader = require('../lib/eventReader');
const eventWriter = require('../lib/eventWriter');
const eventSorter = require('../lib/eventSorter');
const eventDuplicateRemover = require('../lib/eventDuplicateRemover');

const bilbokoKonpartsakEvents = eventReader.readFile('./origins/bilboko-konparsak/data.txt');
const extraEvents = eventReader.readFile('./origins/extras/data.txt');
// const eitbEvents = eventReader.readFile('./origins/eitb/data.txt');

var events = []
    .concat(bilbokoKonpartsakEvents, extraEvents/*, eitbEvents */)
    .sort(eventSorter.sortFn);

// events = eventDuplicateRemover.removeDuplicates(events);

// DIFFERENT LOCATIONS
//
// var locationIndex = {};

// events.forEach((event) => {
//     if (locationIndex[event.location] === undefined) {
//         locationIndex[event.location] = 0;
//     }
//     locationIndex[event.location]++;
// });
// var lines = [];
// Object.keys(locationIndex).forEach((key) => {
//     lines.push(`${key}: ${locationIndex[key]}`);    
// });
// lines = lines.sort();
// lines.forEach((line) => {
//     console.log(line);
// });

eventWriter.writeFile(events, '../data/events_raw.txt');
