class Range {
	#start;
	#end;

	constructor(start, end) {
		if (!Number.isSafeInteger(start))
			throw new TypeError('Expected start to be an Integer');

		if (!Number.isSafeInteger(end))
			throw new TypeError('Expected end to be an Integer');

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
		return new Range(this.#start, this.#end);
	}

	toJSON() {
		return {
			start: this.#start,
			end: this.#end
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Range;