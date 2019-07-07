'use strict';

function parse(rawData) {
	const result = [];
	const data = rawData.replace('\r', '');
	const lines = data.split('\n').slice(1);

	lines.forEach((line) => {
		if (line.trim() === '') return;

		let lineData = [];
		let currentColumn = '';
		let readingColumn = false;

		for (let i = 0; i < line.length; i++) {
			const c = line[i];
			// const prev = i > 0 ? line[i-1] : '';

			if (c === '"' && readingColumn === false) {
				readingColumn = true;
				continue;
			}

			if (c === '"' && readingColumn === true) {
				readingColumn = false;
				lineData.push(currentColumn);
				currentColumn = '';
				continue;
			}

			if (readingColumn === false) {
				continue;
			}

			currentColumn += c;
		}

		result.push(lineData);
	});

	return result;
}

module.exports = parse;
