const fs = require('fs');
const path = require('path');

const Event = require('../common/event');
const csvParser = require('../common/csv-parser');
const eventSorter = require('../common/event-sorter');

function readRawData() {
    return fs.readFileSync(path.join(__dirname, '0-raw.csv'), { encoding: 'utf8' });
}

function getData() {
    return csvParser(readRawData())
        .map(line => new Event(line[0], line[3], line[2], line[1], null, line[4].split('-')))
        .sort(eventSorter.sortFn);
}

module.exports = {
    getData
};

if (require.main === module) {
    console.log(getData());
}
