const fs = require('fs');

const programacionRaw = JSON.parse(fs.readFileSync('./bilboko-konpartsak-app/programacion.json')).message;

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

var programacion = programacionRaw.map(event => {
    var result = {
        name: '',
        location: '',
        day: 0,
        hour: '',
        badges: []
    };

    if (event.nombre_es !== '' && event.nombre_eu !== '') {
        result.name = `[${event.nombre_es}][${event.nombre_eu}]`;
    } else {
        result.name = event.nombre_es || event.nombre_eu;
    }

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

    if (parseInt(result.hour.split(':')[0]) < 6) {
        result.day--;
    }

    if (event.tipo === 'KONTZERTUAK - CONCIERTOS') {
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

    return result;
});

programacion.forEach(event => {
    console.log(`${event.day}|${event.hour}|${event.location}|${event.name}${(event.badges.length > 0 ? `|${(event.badges.join('-'))}` : '')}`)
});
