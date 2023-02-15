class Range {
	/**
	 * @type {number}
	 */
	#start;
	/**
	 * @type {number}
	 */
	#end;

	static createRange(string) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		return new Range(0, string.length - 1);
	}

	/**
	 * Create a new Range. A Range is a pair of Numbers that represent an inclusive, zero-based index range in a String.
	 * @param {number} start 
	 * @param {number} end 
	 */
	constructor(start, end) {
		if (!Number.isSafeInteger(start) || start < 0)
			throw new TypeError('Expected start to be a positive Integer');

		if (!Number.isSafeInteger(end) || end < 0)
			throw new TypeError('Expected end to be a positive Integer');

		this.#start = start;
		this.#end = end;
	}

	/**
	 * @returns {number}
	 */
	get start() {
		return this.#start;
	}

	/**
	 * @returns {number}
	 */
	get end() {
		return this.#end;
	}

	calculateRange(string) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		return new Range(this.#end + 1, this.#end + string.length);
	}

	/**
	 * Performs a deep clone of this Range and returns a new Range.
	 * @returns {Range}
	 */
	clone() {
		return new Range(this.#start, this.#end);
	}

	/**
	 * Returns a JSON-compatible representation of this Range.
	 * @returns {{start: number, end: number}}}
	 */
	toJSON() {
		return {
			start: this.#start,
			end: this.#end
		};
	}

	/**
	 * Converts this Range to a String with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Range;