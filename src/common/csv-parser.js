'use strict';

function parse(rawData) {
    const result = [];
    const data = rawData.replace('\r', '');
    const lines = data.split('\n').slice(1);

    lines.forEach((line) => {
        if (line.trim() === '') return;
        const columns = line.split(',');
        const lineData = [];
        columns.forEach((column) => {
            lineData.push(column.substr(1, column.length-2))
        });
        result.push(lineData);
    });

    return result;
}

module.exports = parse
