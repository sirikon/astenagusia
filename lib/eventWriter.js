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

module.exports = { writeFile }
