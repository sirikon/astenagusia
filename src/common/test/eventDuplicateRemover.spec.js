var assert = require('assert');

const eventDuplicateRemover = require('../lib/eventDuplicateRemover');

const normalizedNameCases = {
  'a': 'A',
  'Kalejira con marijaia': 'KALEJIRA MARIJAIA',
  'Mercado de esculturas': 'ESCULTURAS MERCADO',
  'Roba Estesa': 'ESTESA ROBA',
  'Elektrotxaranga (konparsa rumbera f.r.a.c.)': 'ELEKTROTXARANGA FRAC KONPARSA RUMBERA'
};

const removeDuplicatesCases = [
  {
    in: [{ day: 18, hour: '20:00', location: 'Arriaga', name: 'something', badges: [] }],
    out: [{ day: 18, hour: '20:00', location: 'Arriaga', name: 'something', badges: [] }]
  },
  {
    in: [
      { day: 18, hour: '20:00', location: 'Arriaga', name: 'something', badges: [] },
      { day: 18, hour: '20:00', location: 'Arriaga', name: 'SOMETHING', badges: [] }
    ],
    out: [{ day: 18, hour: '20:00', location: 'Arriaga', name: 'something', badges: [] }]
  },
  {
    in: [
      { day: 18, hour: '20:00', location: 'Arriaga', name: 'something', badges: ['a'] },
      { day: 18, hour: '20:00', location: 'Arriaga', name: 'SOMETHING', badges: ['a', 'b'] }
    ],
    out: [{ day: 18, hour: '20:00', location: 'Arriaga', name: 'SOMETHING', badges: ['a', 'b'] }]
  }
];

describe('Event Duplicate Remover', function() {
  describe('normalizeName()', function() {

    Object.keys(normalizedNameCases).forEach((key) => {
      it ('should work with: ' + key, function() {
        assert.equal(eventDuplicateRemover.normalizeName(key), normalizedNameCases[key]);
      });
    });

  });

  describe('removeDuplicates()', function() {

    removeDuplicatesCases.forEach((duplicateCase, i) => {
      it ('should work with case #' + (i + 1), function() {
        assert.deepEqual(eventDuplicateRemover.removeDuplicates(duplicateCase.in), duplicateCase.out);
      })
    });

  });

});
