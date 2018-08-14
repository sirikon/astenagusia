'use strict';

const fs = require('fs');

const eventConvert = require('./eventConvert');

function writeFile(events, path) {
    var fileContents = events
        .map((event) => {
            return eventConvert.stringify(event);
        })
        .join('\n');

    fs.writeFileSync(path, fileContents, { encoding: 'utf8' });
}

function writeStdout(events) {
    events.forEach((event) => {
        console.log(eventConvert.stringify(event));
    });    
}

module.exports = { writeFile, writeStdout }
