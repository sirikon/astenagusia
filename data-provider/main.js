const eventReader = require('../lib/eventReader');
const eventConvert = require('../lib/eventConvert');
const eventSorter = require('../lib/eventSorter');

const bilbokoKonpartsakEvents = eventReader.readFile('./origins/bilboko-konparsak/data.txt');
const extraEvents = eventReader.readFile('./origins/extras/data.txt');

var events = []
    .concat(bilbokoKonpartsakEvents, extraEvents)
    .sort(eventSorter.sortFn);

events.forEach((event) => {
    console.log(eventConvert.stringify(event));
});
