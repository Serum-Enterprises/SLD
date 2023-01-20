class Position {
	#line;
	#column;

	constructor(line, column) {
		if (!Number.isSafeInteger(line))
			throw new TypeError('Expected line to be an Integer');

		if (!Number.isSafeInteger(column))
			throw new TypeError('Expected column to be an Integer');

		this.#line = line;
		this.#column = column;
	}

	get line() {
		return this.#line;
	}

	get column() {
		return this.#column;
	}

	clone() {
		return new Position(this.#line, this.#column);
	}

	toJSON() {
		return {
			line: this.#line,
			column: this.#column
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Position;