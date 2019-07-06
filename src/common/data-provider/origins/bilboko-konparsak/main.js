const fs = require('fs');

const eventWriter = require('../../../lib/eventWriter');

const programacionRaw = JSON.parse(fs.readFileSync('./programacion.json')).message;

const UPPERCASES = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
const LOWERCASES = UPPERCASES.toLowerCase();

function normalizeText (text) {
    var result = [];
    var previousCharType = '';
    for(var i = 0; i < text.length; i++) {
        var char = text[i];

        if (UPPERCASES.indexOf(char) >= 0) {
            if (previousCharType === 'space' || previousCharType === '') {
                result.push(char.toUpperCase());
            } else {
                result.push(char.toLowerCase());
            }
            previousCharType = 'uppercase';
            continue;
        }

        if (LOWERCASES.indexOf(char) >= 0) {
            if (previousCharType === 'space' || previousCharType === '') {
                result.push(char.toUpperCase());
            } else {
                result.push(char.toLowerCase());
            }
            previousCharType = 'lowercase';
            continue;
        }

        if (char === ' ') {
            result.push(' ');
            previousCharType = 'space';
            continue;
        }

        result.push(char);
        previousCharType = '';
    }

    return result.join('');
}

const MARIJAIAN_EVENTS = ['545', '326', '433', '434', '302', '415'];

var programacion = programacionRaw.map(event => {
    var result = {
        name: '',
        name_eu: '',
        location: '',
        day: 0,
        hour: '',
        badges: []
    };

    result.name = event.nombre_es || event.nombre_eu;
    result.name_eu = event.nombre_eu || event.nombre_es;

    result.location = normalizeText(event.lugar);
    result.hour = event.hora.split(':').slice(0, 2).join(':');
    result.day = parseInt(event.fecha.split('-')[2]);

    if (result.location === 'AixeBerri') {
        result.location = 'Aixe Berri';
    }

    if (result.location === 'Areatza') {
        result.location = 'Arenal';
    }

    if (result.location === 'Euskal Museoa - Museo Vasco') {
        result.location = 'Euskal Museoa';
    }

    if (result.location === 'Pa Ya') {
        result.location = 'Pa...Ya!';
    }

    if (result.location === 'Arriagako Atzekaldea') {
        result.location = 'Arriagako Atz.';
    }

    if (result.location === 'Gas Plaza - Plaza Del Gas') {
        result.location = 'Gas Plaza';
    }

    if (result.location === 'Plaza Barria - Plaza Nueva') {
        result.location = 'Plaza Nueva';
    }

    if (result.location === 'Santiago Plaza - Plaza Santiago') {
        result.location = 'Santiago Plaza';
    }

    if (result.location === 'Etxebarria Parkea - Parque Etxebarria') {
        result.location = 'Etxebarria Parkea';
    }

    if (result.location === 'Zabalguneko Merkatua') {
        result.location = 'Zabalguneko Merk.';
    }

    if (result.location === 'Abante') {
        result.location = 'Abante!'
    }

    if (result.location === 'Konsuletxearen Plaza - Plazuela Del Consulado') {
        result.location = 'Konsuletxearen Pl.'
    }

    if (result.location === 'Arriagako Agertokia - Escenario Arriaga') {
        result.location = 'Arriagako Ager.'
    }

    if (result.location === 'Mamiki-Txomin') {
        result.location = 'Mamiki';
    }

    if (result.location === 'Hph') {
        result.location = 'Hau Pittu Hau';
    }

    if (result.location === 'Sestaotik Udaletxera - De Sestao Al Ayuntamiento') {
        result.location = 'Sestaotik Udaletxera'
    }

    if (parseInt(result.hour.split(':')[0]) < 6) {
        result.day--;
    }

    if (event.tipo === 'KONTZERTUAK - CONCIERTOS' || event.tipo === 'MUSIKA - M\u00faSICA') {
        result.badges.push('🎵');
    }

    if (event.tipo === 'LEHIAKETA - CONCURSO') {
        result.badges.push('🏆');
    }

    if (event.tipo === 'DANTZAK - BAILES') {
        result.badges.push('💃');
    }

    if (event.tipo === 'TAILERRAK - TALLERES') {
        result.badges.push('🛠️');
    }

    if (event.tipo.indexOf('GASTRONOMIA') >= 0) {
        result.badges.push('🍲');
    }

    if (event.tipo === 'PIROTEKNIA - PIROTECNIA') {
        result.badges.push('🎇');
    }

    if (event.tipo === 'SU ARTIFIZIALAK - FUEGOS ARTIFICIALES') {
        result.badges.push('🎆')
    }

    if (event.tipo.indexOf('ERAKUSKETA') >= 0) {
        result.badges.push('🖼️');
    }

    if (event.tipo === 'KALEJIRA') {
        result.badges.push('🥁');
    }

    if (event.tipo === 'KIROLAK - DEPORTES') {
        if (event.nombre_es.toLowerCase().indexOf('ajedrez') >= 0) {
            result.badges.push('♟️');
        } else if (event.nombre_es.toLowerCase().indexOf('waterpolo') >= 0) {
            result.badges.push('🤽');
        } else if (event.nombre_es.toLowerCase().indexOf('basket') >= 0) {
            result.badges.push('🏀');
        } else {
            result.badges.push('🤾‍');
        }
    }

    if (event.nombre_es.toLowerCase().indexOf('bilbo hiria') >= 0) {
        result.badges.push('📻');
    }

    if (event.nombre_es.toLowerCase().indexOf('photocall') >= 0) {
        result.badges.push('📷');
    }

    if (event.tipo === 'JOLASAK - JUEGOS') {
        if (
            event.nombre_es.toLowerCase().indexOf('rol') >= 0 ||
            event.nombre_es.toLowerCase().indexOf('mesa') > 0 ||
            event.id === '560'
        ) {
            result.badges.push('🎲');
        } else {
            result.badges.push('⛳');
        }
    }

    if (event.id === '495') {
        result.name = 'Taller de Reciclaje'
    }

    if (MARIJAIAN_EVENTS.indexOf(event.id) >= 0) {
        result.badges.push('🙆');
    }

    if (event.id === '545') {
        result.badges.push('😭');
    }

    return result;
});

eventWriter.writeStdout(programacion);
