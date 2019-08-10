const fs = require('fs');
const path = require('path');

const Event = require('../common/event');
const csvParser = require('../common/csv-parser');
const eventSorter = require('../common/event-sorter');

function readRawData() {
	return fs.readFileSync(path.join(__dirname, '0-raw.csv'), { encoding: 'utf8' });
}

function getDataFromRaw() {
	return csvParser(readRawData())
		.map(line => new Event(line[0], line[3], line[2], line[1], null, line[4].split('-')));
}

function padNumber(n) {
	let result = n.toString();
	if (result.length === 1) {
		result = '0'+result;
	}
	return result;
}

function getDataFromUdalaApp() {
	const data = fs.readFileSync(path.join(__dirname, '0-udala-app-events.json'));
	const events = JSON.parse(data);
	return events
		.filter((e) => {
			if (e.place_es === 'Sala Bilborock') return false;
			if (e.place_es === 'Plaza de toros') return false;
			return true;
		})
		.map((e) => {
			const date = new Date(e.date);
			return new Event(
				date.getDate().toString(),
				`${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`,
				e.place_es,
				e.title_es + (e.description_es ? `. ${e.description_es}` : ''),
				e.title_eu + (e.description_eu ? `. ${e.description_eu}` : ''),
				[]
			);
		});
}

function getData() {
	return []
		.concat(getDataFromRaw(), getDataFromUdalaApp())
		.sort(eventSorter.sortFn);
}

module.exports = {
	getData
};

if (require.main === module) {
	console.log(getData());
}
