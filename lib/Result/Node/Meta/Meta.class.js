const Location = require('./Location/Location.class');
const Range = require('./Range/Range.class');

class Meta {
	/**
	 * @type {Range}
	 */
	#range;
	/**
	 * @type {Location}
	 */
	#location;

	/**
	 * @returns {typeof Range}
	 */
	static get Range() {
		return Range;
	}

	/**
	 * @returns {typeof Location}
	 */
	static get Location() {
		return Location;
	}

	/**
	 * Create a new Meta based on the given string.
	 * @param {string} string 
	 * @returns {Meta}
	 */
	static createMeta(string) {
		if (typeof string !== 'string' || string.length === 0)
			throw new TypeError('Expected string to be a non-empty String');

		return new Meta(
			Range.createRange(string),
			Location.createLocation(string)
		);
	}

	/**
	 * Create a new Meta based on the given Range and Location.
	 * @param {Range} range 
	 * @param {Location} location 
	 */
	constructor(range, location) {
		if (!(range instanceof Range))
			throw new TypeError('Expected range to be a Range');

		if (!(location instanceof Location))
			throw new TypeError('Expected location to be a Location');

		this.#range = range;
		this.#location = location;
	}

	/**
	 * @returns {Range}
	 */
	get range() {
		return this.#range;
	}

	/**
	 * @returns {Location}
	 */
	get location() {
		return this.#location;
	}

	/**
	 * Calculate the Meta based on the given string.
	 * @param {string} string 
	 * @returns {Meta}
	 */
	calculateMeta(string) {
		if (typeof string !== 'string' || string.length === 0)
			throw new TypeError('Expected string to be a non-empty String');

		return new Meta(
			this.#range.calculateRange(string),
			this.#location.calculateLocation(string)
		);
	}

	/**
	 * Perform a deep clone of this Meta.
	 * @returns {Meta}
	 */
	clone() {
		return new Meta(
			this.#range.clone(),
			this.#location.clone()
		);
	}

	/**
	 * Returns a JSON representation of this Meta.
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			range: this.#range.toJSON(),
			location: this.#location.toJSON()
		};
	}

	/**
	 * Returns a string representation of this Meta with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Meta;