window.addEventListener("hashchange", function () {
    if (window.location.hash.indexOf('_hour_') >= 0) {
        window.scrollTo(window.scrollX, window.scrollY - 42);
    }
});
