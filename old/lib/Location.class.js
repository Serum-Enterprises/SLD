const { Position } = require('./Position.class');

class Location {
	/**
	 * @type {Position}
	 */
	#start;
	/**
	 * @type {Position}
	 */
	#end;

	/**
	 * Create a new Location based on the given string.
	 * @param {string} string 
	 * @returns {Location}
	 */
	static createLocation(string) {
		if (typeof string !== 'string' || string.length === 0)
			throw new TypeError('Expected string to be a non-empty String');

		const lines = string.split(/\r\n|\r|\n/);

		return new Location(
			new Position(1, 1),
			lines.length === 1 ?
				new Position(1, lines[0].length) :
				new Position(lines.length, lines[lines.length - 1].length)
		);
	}

	/**
	 * Create a new Location based on the given start and end Positions.
	 * @param {Position} start 
	 * @param {Position} end 
	 */
	constructor(start, end) {
		if (!(start instanceof Position))
			throw new TypeError('Expected start to be an instance of Position');

		if (!(end instanceof Position))
			throw new TypeError('Expected end to be an instance of Position');

		this.#start = start;
		this.#end = end;
	}

	/**
	 * @returns {Position}
	 */
	get start() {
		return this.#start;
	}

	/**
	 * @returns {Position}
	 */
	get end() {
		return this.#end;
	}

	/**
	 * Calculate a new Location based on the given string
	 * @param {string} string 
	 * @returns {Location}
	 */
	calculateLocation(string) {
		if (typeof string !== 'string' || string.length === 0)
			throw new TypeError('Expected string to be a non-empty String');

		const lines = string.split(/\r\n|\r|\n/).filter(line => line.length > 0);

		if (lines.length === 0)
			return new Location(
				new Position(this.#end.line, this.#end.column + string.length),
				new Position(this.#end.line, this.#end.column + string.length)
			);

		return new Location(
			new Position(this.#end.line, this.#end.column + 1),
			lines.length === 1 ?
				new Position(this.#end.line, this.#end.column + lines[0].length) :
				new Position(this.#end.line + lines.length - 1, lines[lines.length - 1].length)
		);
	}

	/**
	 * Performs a deep clone of this Location and returns a new Location.
	 * @returns {Location}
	 */
	clone() {
		return new Location(this.#start.clone(), this.#end.clone());
	}

	/**
	 * Returns a JSON-compatible representation of this Location.
	 * @returns {{start: {line: number, column: number}, end: {line: number, column: number}}}
	 */
	toJSON() {
		return {
			start: this.#start,
			end: this.#end
		};
	}

	/**
	 * Returns a String representation of this Location with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = { Location };