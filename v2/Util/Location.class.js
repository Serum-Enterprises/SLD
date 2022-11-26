class Location {
	#start = new Position(0, 0);
	#end = new Position(0, 0);

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