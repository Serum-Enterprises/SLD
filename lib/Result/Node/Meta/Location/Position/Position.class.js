class Position {
	/**
	 * @type {number}
	 */
	#line;
	/**
	 * @type {number}
	 */
	#column;

	/**
	 * A Position represent a specific line and column in a String. Positions are one-based.
	 * @param {number} line 
	 * @param {number} column 
	 */
	constructor(line, column) {
		if (!Number.isSafeInteger(line) || line < 1)
			throw new TypeError('Expected line to be an Integer greater than 0');

		if (!Number.isSafeInteger(column) || column < 1)
			throw new TypeError('Expected column to be an Integer greater than 0');

		this.#line = line;
		this.#column = column;
	}

	/**
	 * @returns {number}
	 */
	get line() {
		return this.#line;
	}

	/**
	 * @returns {number}
	 */
	get column() {
		return this.#column;
	}

	/**
	 * Performs a deep clone of this Position and returns a new Position.
	 * @returns {Position}
	 */
	clone() {
		return new Position(this.#line, this.#column);
	}

	/**
	 * Returns a JSON-compatible representation of this Position.
	 * @returns {{line: number, column: number}}
	 */
	toJSON() {
		return {
			line: this.#line,
			column: this.#column
		};
	}
	/**
	 * Converts this Position to a String with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Position;