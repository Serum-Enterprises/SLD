const Position = require('./Position.class');

class Location {
	#start;
	#end;

	// Calculate a new Location based on a previous Location and the given codeString
	static calculateLocation(precedingLocation, codeString) {
		if (typeof codeString !== 'string')
			throw new TypeError('Expected codeString to be a String');

		const lines = codeString.split(/\r\n|\r|\n/);

		if(precedingLocation === null) {
			return new Location(
				new Position(1, 1),
				new Position(lines.length, lines[lines.length - 1].length)
			);
		}
		else if(precedingLocation instanceof Location) {
			return new Location(
				new Position(precedingLocation.end.line, precedingLocation.end.column + 1),
				lines.length === 1 ? 
				new Position(precedingLocation.end.line, precedingLocation.end.column + lines[0].length) : 
				new Position(precedingLocation.end.line + lines.length - 1, lines[lines.length - 1].length)
			);
		}
		else
			throw new TypeError('Expected precedingLocation to be an instance of Location or null');
	}

	constructor(start, end) {
		if (!(start instanceof Position))
			throw new TypeError('Expected start to be an instance of Position');

		if (!(end instanceof Position))
			throw new TypeError('Expected end to be an instance of Position');

		this.#start = start;
		this.#end = end;
	}

	get start() {
		return this.#start;
	}

	get end() {
		return this.#end;
	}

	clone() {
		return new Location(this.#start.clone(), this.#end.clone());
	}

	toJSON() {
		return {
			start: this.#start.toJSON(),
			end: this.#end.toJSON()
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Location;