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
		.map((line) => new Event(line, line[0], line[3], line[2], line[1], null, line[4].split('-')));
}

function padNumber(n) {
	let result = n.toString();
	if (result.length === 1) {
		result = '0'+result;
	}
	return result;
}

function addBadge(badges, newBadge) {
	if (badges.indexOf(newBadge) >= 0) return;
	badges.push(newBadge);
}

function getDataFromUdalaApp() {
	const data = fs.readFileSync(path.join(__dirname, '0-udala-app-events.json'));
	const events = JSON.parse(data);
	return events
		.filter((e) => {
			if (e.place_es === 'Sala Bilborock') return false;
			if (e.place_es === 'Plaza de toros') return false;
			if (e.kategory_id === '8') return false;
			return true;
		})
		.map((e) => {
			const date = new Date(e.date);
			return new Event(
				e,
				date.getDate().toString(),
				`${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`,
				e.place_es,
				e.title_es + (e.description_es ? `. ${e.description_es}` : ''),
				e.title_eu + (e.description_eu ? `. ${e.description_eu}` : ''),
				[]
			);
		})
		.map((e) => {
			if (e.original.title_en === 'Concert by the Municipal Band.') {
				addBadge(e.badges, '🎵');
			}
			if (e.original.kategory_id === '0') {
				addBadge(e.badges, '🎵');
			}
			if (e.original.kategory_id === '2') {
				addBadge(e.badges, '🎭');
			}
			if (e.original.kategory_id === '3') {
				addBadge(e.badges, '⚽');
			}
			if (e.original.kategory_id === '6') {
				addBadge(e.badges, '🖊️');
				addBadge(e.badges, '📃');
			}
			if (['10', '44', '75', '105', '137', '171', '203', '236', '247'].indexOf(e.original.id) >= 0) {
				addBadge(e.badges, '🎆');
			}
			if (['3', '5', '118', '262'].indexOf(e.original.id) >= 0) {
				addBadge(e.badges, '🙆');
			}
			if (['262'].indexOf(e.original.id) >= 0) {
				addBadge(e.badges, '🔥');
			}
			return e;
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
