class CustomError extends Error {
	#index;

	constructor(message, index) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		if (!Number.isSafeInteger(index))
			throw new TypeError('Expected index to be an Integer');

		if (index < 0)
			throw new RangeError('Expected index to be greater than or equal to 0');

		super(message);
		this.#index = index;
	}

	get index() {
		return this.#index;
	}

	toString() {
		return `${this.name}: ${this.message}`;
	}
}

module.exports = { CustomError };