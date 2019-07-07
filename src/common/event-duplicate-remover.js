'use strict';

const fuzzyCompare = require('fuzzy-compare');

const ALLOWED_CHARS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789 ';
const IGNORED_WORDS = ['CON', 'DE', 'WITH', 'AND', '&', 'THE', '+', 'ETA', 'Y'];
const CHAR_REPLACEMENT_MAP = {
	'á': 'a',
	'à': 'a',
	'ä': 'a',
	'é': 'e',
	'è': 'e',
	'ë': 'e',
	'í': 'i',
	'ì': 'i',
	'ï': 'i',
	'ó': 'o',
	'ò': 'o',
	'ö': 'o',
	'ú': 'u',
	'ù': 'u',
	'ü': 'u',
	'ñ': 'n'
};

function normalizeName(name) {
	name = name.toLowerCase();
	var result = [];

	for(var i = 0; i < name.length; i++) {
		var char = name[i];
		char = CHAR_REPLACEMENT_MAP[char] || char;
		if (ALLOWED_CHARS.indexOf(char) >= 0) {
			result.push(char);
		}
	}

	var normalizedName = result.join('').toUpperCase().trim();

	var words = normalizedName.split(' ')
		.filter((word) => {
			if (word === '' || word === null || word === undefined) {
				return false;
			}

			if (IGNORED_WORDS.indexOf(word) >= 0) {
				return false;
			}

			return true;
		})
		.sort();
    
	return words.join(' ');
}

function removeDuplicates(events) {
	var result = [];
	var dayHourLocationIndex = {};

	events.forEach((event) => {
		var key = `${event.day}_${event.hour.replace(':', '_')}_${event.location}`.toUpperCase();
		if (dayHourLocationIndex[key] === undefined) {
			dayHourLocationIndex[key] = [];
		}
		dayHourLocationIndex[key].push(event);
	});

	Object.keys(dayHourLocationIndex).forEach((key) => {
		var events = dayHourLocationIndex[key];
        
		events.forEach((event) => {
			if (event.__invalid) return;

			var versions = [event];

			events.forEach((eventB) => {
				if (event === eventB) return;
				if (eventB.__invalid) return;

				var aNormalizedName = normalizeName(event.name);
				var bNormalizedName = normalizeName(eventB.name);

				if (fuzzyCompare({ name: aNormalizedName }, { name: bNormalizedName }).equal > 0.5) {
					versions.push(eventB);
				}
			});

			var bestVersion = null;

			versions.forEach((version) => {
				if (bestVersion === null) {
					bestVersion = version;
					return;
				}
				if (version.badges.length > bestVersion.badges.length) {
					bestVersion = version;
				}
			});

			versions.forEach((version) => {
				if (version !== bestVersion) {
					version.__invalid = true;
				}
			});
		});

		events.forEach((event) => {
			if (!event.__invalid) {
				result.push(event);
			}
		});
	});

	return result;
}

module.exports = {
	normalizeName,
	removeDuplicates
};
