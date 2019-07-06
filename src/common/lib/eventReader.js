'use strict';

const fs = require('fs');

const eventConvert = require('./eventConvert');

function readFile(path) {
    var result = [];
    let eventsRaw = fs.readFileSync(path, { encoding: 'utf8' });
    eventsRaw = eventsRaw.replace('\r', '');
    const lines = eventsRaw.split('\n');

    lines.forEach((line) => {
        if (line === '') return;
        result.push(eventConvert.parse(line));
    });

    return result;
}

module.exports = { readFile }
