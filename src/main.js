var dynamicStyleElement = document.querySelector('#dynamic-style');
var filterButtonElement = document.querySelector('.title-filter');
var locationMenuElement = document.querySelector('.location-popup');

var state = {
    currentFilter: null,
    filterMenuOpen: false
};

function scroll(px) {
    window.scrollTo(window.scrollX, window.scrollY + px);
}

window.addEventListener("hashchange", function () {
    if (window.location.hash.indexOf('_hour_') >= 0) {
        scroll(-102);
    } else {
        scroll(-59);
    }
});

function render() {
    if (state.currentFilter !== null) {
        dynamicStyleElement.textContent = '' +
            '[data-location] { display: none; } ' +
            '[data-locations] { display: none; } ' +
            '[data-location="' + state.currentFilter + '"] { display: block; }' +
            '[data-locations*="__' + state.currentFilter + '__"] { display: block; }';
        filterButtonElement.querySelector('span').textContent = 'Borrar filtro (' + state.currentFilter + ')';
    } else {
        dynamicStyleElement.textContent = '';
        filterButtonElement.querySelector('span').textContent = 'Filtrar por lugar';
    }

    locationMenuElement.classList.toggle('location-popup--visible', state.filterMenuOpen);
    document.body.classList.toggle('scroll-blocked', state.filterMenuOpen);
}

function onFilterButtonClick() {
    if (state.currentFilter === null) {
        state.filterMenuOpen = true;
    } else {
        state.currentFilter = null;
    }

    render();
}

function onFilterOptionClick(locationName) {
    state.currentFilter = locationName;
    state.filterMenuOpen = false;

    render();
}

filterButtonElement.addEventListener('click', onFilterButtonClick);
