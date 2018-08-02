var Crawler = require("crawler");

function findHour(text) {
    var result = text.match(/[0-9]{2}:[0-9]{2}/g);
    if (!result) return false;
    if (result.length === 0) {
        return false;
    }
    else {
        return result[0];
    }
}

function cleanParagraph(text) {
    var hour = findHour(text);
    if (hour) {
        text = text.replace(hour, '');
    }
    text = text.replace(/[\.\:\- ]/, '').trim();
    return text;
}

function getName(element) {
    var clone = element.clone();
    clone.find('b, strong').remove();
    var name = clone.text().trim();

    var hour = findHour(name);
    if (hour) {
        name = name.replace(hour, '');
    }

    name = name.replace(/^[\.\-: ]*/, '').trim();

    return name;
}

function getLocation(element) {
    var text = element.find('b, strong').first().text();
    text = text.replace(/^[\.\-: ]*/, '').trim();
    return text;
}

function parseDay(text) {
    return parseInt(text.match(/[0-9]+/)[0]);
}

function process($) {
    var paragraphs = $('#cont_embed_noticia > p');

    var result = {};
    var currentDay = '';
    var currentHour = '';

    paragraphs.each(function (i, p) {
        var underlined = $(this).find('[style="text-decoration: underline;"]');
        underlined.each(function (i, underlined) {
            currentDay = $(this).text();
        });

        if (!currentDay) return;
        if (!result[currentDay]) {
            result[currentDay] = {
                day: parseDay(currentDay),
                events: []
            };
        }

        function addEvent(event) {
            result[currentDay].events.push(event);
        }

        var text = $(this).text().trim();
        var hour = findHour(text);

        if (hour) {
            currentHour = hour;

            var cleanText = cleanParagraph(text);

            if (cleanText !== '') {
                var newEvent = {
                    hour: hour,
                    location: getLocation($(this)),
                    name: getName($(this))
                }
                addEvent(newEvent);
            }
            return;
        }

        if (text.substr(0, 1) === '-') {
            var newEvent = {
                hour: currentHour,
                location: getLocation($(this)),
                name: getName($(this))
            }
            addEvent(newEvent);
        }
    });

    printResult(result);
}

function printResult(result) {
    // Object.keys(result).forEach((key) => {
    //     console.log(key);
    //     var events = result[key];
    //     events.forEach((event) => {
    //         console.log(`${event.hour} | ${event.location} | ${event.name}`);
    //     })
    // })
    console.log(JSON.stringify(result, null, 2));
}

var c = new Crawler({
    maxConnections : 1,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            process($);
        }
        done();
    }
});

c.queue('https://www.eitb.eus/es/pueblos-ciudades/detalle/5768155/programa-bilboko-konpartsak-aste-nagusia-2018-programacion-comparsas/');
