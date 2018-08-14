function getHourInfo(hourText) {
    var chunks = hourText.split(':');
    var hours = parseInt(chunks[0]);
    var minutes = parseInt(chunks[1]);

    var hoursForSortValue = (hours - 6 + 24) % 24;

    return {
        hours,
        minutes,
        sortValue: ((hoursForSortValue * 60) + minutes)
    }
}

function sortFn(a, b) {
    if (a.day < b.day) {
        return -1;
    }
    if (a.day > b.day) {
        return 1;
    }

    var aHourSortValue = getHourInfo(a.hour).sortValue;
    var bHourSortValue = getHourInfo(b.hour).sortValue;

    if (aHourSortValue < bHourSortValue) {
        return -1;
    }
    if (aHourSortValue > bHourSortValue) {
        return 1;
    }

    if (a.location < b.location) {
        return -1;
    }
    if (a.location > b.location) {
        return 1;
    }

    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }

    return 0;
}

module.exports = { sortFn };
