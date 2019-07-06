class Event {
    constructor(day, hour, location, name, name_eu, badges) {
        this.day = day;
        this.hour = hour;
        this.location = location;
        this.name = name;
        this.name_eu = name_eu || name;
        this.badges = badges || [];
    }
}

module.exports = Event;
