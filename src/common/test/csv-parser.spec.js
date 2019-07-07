const assert = require('assert');

const csvParser = require('../csv-parser');

describe('CSV Parser', function () {

	it('should return an empty array with an empty input', function() {
		assert.deepEqual(csvParser(''), []);
	});

	it('should return an empty array when using just headers as input', function() {
		assert.deepEqual(csvParser('"a"'), []);
	});

	it('should return an array with a single item', function() {
		assert.deepEqual(csvParser('"a"\n"1"'), [['1']]);
	});

	it('should return an array with a single line and multiple columns', function() {
		assert.deepEqual(csvParser('"a","b","c"\n"1","2","3"'), [['1', '2', '3']]);
	});

	it('should return an array of multiple lines and columns', function() {
		assert.deepEqual(csvParser('"a","b"\n"1","2"\n"3","4"'), [['1', '2'], ['3', '4']]);
	});

	it('should control commas inside columns', function() {
		assert.deepEqual(csvParser('"a","b"\n"1,1","2,1"\n"1,2","2,2"'), [['1,1', '2,1'], ['1,2', '2,2']]);
	});

});
