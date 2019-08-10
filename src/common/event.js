class Event {
	constructor(original, day, hour, location, name, name_eu, badges) {
		this.original = original;
		this.day = day;
		this.hour = hour;
		this.location = location;
		this.name = name;
		this.name_eu = name_eu || name;
		this.badges = badges || [];
	}
}

module.exports = Event;
