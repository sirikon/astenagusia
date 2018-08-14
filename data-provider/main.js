const eventReader = require('../lib/eventReader');
const eventWriter = require('../lib/eventWriter');
const eventSorter = require('../lib/eventSorter');

const bilbokoKonpartsakEvents = eventReader.readFile('./origins/bilboko-konparsak/data.txt');
const extraEvents = eventReader.readFile('./origins/extras/data.txt');

var events = []
    .concat(bilbokoKonpartsakEvents, extraEvents)
    .sort(eventSorter.sortFn);

eventWriter.writeStdout(events);
