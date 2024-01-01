class MisMatchError extends Error {
	#index;

	/**
	 * Create a new MisMatchError Instance
	 * @param {string} message 
	 * @param {number} index 
	 */
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

	/**
	 * Get the index
	 */
	get index() {
		return this.#index;
	}

	/**
	 * Get the string representation of the MisMatchError
	 * @returns {string}
	 */
	toString() {
		return `[MisMatchError] ${this.message} at index ${this.#index}`;
	}
}

module.exports = { MisMatchError };