const fs = require('fs');
const path = require('path');

const jsdom = require('jsdom');

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

function beautifyText(text) {
	return text.split(' ')
		.map(t => t.toLowerCase())
		.map(t => {
			return `${t.slice(0, 1).toUpperCase()}${t.slice(1, t.length)}`;
		})
		.join(' ');
}

function getNameAndHours(text) {
	const regexp = /[0-9]{2}:[0-9]{2}/g;
	const hours = [];
	let match = null;
	while ((match = regexp.exec(text)) != null) {
		hours.push(match);
	}

	return {
		name: text.replace(regexp, '').trim(),
		hours: hours.map(h => h[0]),
	};
}

function getDataFromMondoSonoro() {	
	const data = fs.readFileSync(path.join(__dirname, '0-mondosonoro.html'));
	const dom = new jsdom.JSDOM(data, { encoding: 'utf-8' });

	const result = [];

	const paragraphs = dom.window.document.querySelectorAll('p');
	for(let i = 0; i < paragraphs.length; i++) {
		const p = paragraphs[i];

		let e = null;

		let previousWasStrong = false;

		for(let x = 0; x < p.childNodes.length; x++) {
			const c = p.childNodes[x];
			if (c.tagName && c.tagName.toLowerCase() === 'strong') {
				if (e != null) {
					result.push(e);
				}
				e = new Event(null, p.id);
				addBadge(e.badges, '🎵');
				e.name = c.textContent;
				e.name_eu = c.textContent;
				previousWasStrong = true;
				continue;
			}
			if (previousWasStrong && c.tagName === undefined) {
				const result = getNameAndHours(c.textContent);
				e.location = result.name;
				e.hour = result.hours[0];
			}
			previousWasStrong = false;
		}
	}

	const locationBlacklist = [
		'Bilborock',
		'Nave',
		'Nave 9',
		'Pl. Circular  /',
		'Encarnación',
		'La Carbonerí­a',
		'Pérgola  /',
		'Shake',
		'Algara',
		'Kafe Antzokia',
		'Mamiki',
		'Txomin Barullo',
		'Abandoibarra',
		'Plaza Nueva',
		's Askapeña',
		'Euskalgune',
		'Txinbotarrak',
		'Aixeberri',
		'Aixe Berri',
		'Pa…Ya!',
		'Tintigorri',
		'Irrinzti',
		'Komantxe',
		'Pinpilinpauxa',
		'Parque Europa',
		'Altxaporrue',
		'Zaratas'
	];
	return result
		.filter(r => {
			if (!r.hour) {
				console.log('Missing hour: ', r.name);
				return false;
			}
			return true;
		})
		.filter(r => {
			if (locationBlacklist.indexOf(r.location) >= 0) return false;
			return true;
		});
}

function getDataFromKonpartsakApp() {
	const data = fs.readFileSync(path.join(__dirname, '0-konpartsak-events.json'));
	const object = JSON.parse(data);
	return object.message
		.filter((e) => {
			if (e.nombre_es.toLowerCase().indexOf('apertura de txosnas') >= 0) return false;
			if (e.nombre_eu.toLowerCase().indexOf('harrera marijaiari') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('ajedrez') >= 0) return false;
			if (e.nombre_es.toLowerCase() === 'toro de fuego') return false;
			if (e.nombre_es.toLowerCase().indexOf('open magic') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('taller de txalaparta') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('salsa verde') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('bkaff') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('ensalada de frutas') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('waterpolo') >= 0) return false;
			if (e.nombre_es.toLowerCase().indexOf('txupin homenaje') >= 0) return false;
			if (e.tipo.toLowerCase().indexOf('fuegos artificiales') >= 0) return false;
			if (e.nombre_eu.toLowerCase().indexOf('txistularien') >= 0) return false;
			return true;
		})
		.map((e) => {
			return new Event(
				e,
				e.fecha.split('-')[2],
				e.hora.split(':').slice(0,2).join(':'),
				beautifyText(e.lugar),
				e.nombre_es || e.nombre_eu,
				e.nombre_eu || e.nombre_es,
				[]
			);
		})
		.map((e) => {
			if (
				e.original.tipo === 'KONTZERTUAK - CONCIERTOS'
				|| e.original.tipo.indexOf('MUSIKA') >= 0) {
				addBadge(e.badges, '🎵');
			}
			if (e.original.tipo.indexOf('GASTRONOMIA') >= 0) {
				addBadge(e.badges, '🍖');
			}
			return e;
		});
}

function getDataFromUdalaApp() {
	const data = fs.readFileSync(path.join(__dirname, '0-udala-app-events.json'));
	const events = JSON.parse(data);
	return events
		.filter((e) => {
			if (e.title_es && e.title_es.toLowerCase().indexOf('reparto de pinchos') >= 0) return false;
			if (e.place_id === 'bilborock_aretoa') return false;
			if (e.place_id === 'zezen_plaza') return false;
			if (e.place_id === 'plaza_barria') return false;
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
			if (e.original.title_en === 'Concert by the Municipal Band.' || e.original.id === '101') {
				addBadge(e.badges, '🎵');
			}
			if (e.original.title_es.toLowerCase().indexOf('toro de fuego') >= 0) {
				addBadge(e.badges, '🔥');
				addBadge(e.badges, '🐂');
			}
			if (e.original.title_es.toLowerCase().indexOf('gastro') >= 0) {
				addBadge(e.badges, '🍖');
			}
			if (e.original.title_es.toLowerCase().indexOf('mus') >= 0) {
				addBadge(e.badges, '🃏');
			}
			if (e.original.title_es.toLowerCase().indexOf('ajedrez') >= 0) {
				addBadge(e.badges, '♟️');
			}
			if (e.original.kategory_id === '0') {
				addBadge(e.badges, '🎵');
			}
			if (
				e.original.kategory_id === '2'
				|| (e.original.title_es.toLowerCase().indexOf('teatro') >= 0 && e.original.place_id !== 'arriaga_antzoki')) {
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
			if (['34', '65', '95', '128', '162', '194', '227', '258'].indexOf(e.original.id) >= 0 || e.original.dantzak === '1') {
				addBadge(e.badges, '💃');
			}
			if (['1', '3', '5', '118', '262'].indexOf(e.original.id) >= 0) {
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
		.concat(getDataFromRaw(), getDataFromUdalaApp(), getDataFromKonpartsakApp(), getDataFromMondoSonoro())
		.filter(e => {
			if (!e.location) {
				console.log(e);
				return false;
			}
			return true;
		})
		.sort(eventSorter.sortFn);
}

module.exports = {
	getData
};

if (require.main === module) {
	const data = getDataFromMondoSonoro();
	data.forEach((item) => {
		console.log(`[${item.day}] [${item.hour}] ${item.name} [${item.location}]`);
	});
	// console.log(getNameAndHours('Algara 12:30 + 01:30'));
}
