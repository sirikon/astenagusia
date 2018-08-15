class Event {
    constructor(day, hour, location, name, badges) {
        this.day = day;
        this.hour = hour;
        this.location = location;
        this.name = name;
        this.badges = badges || [];
    }
}

module.exports = Event;
