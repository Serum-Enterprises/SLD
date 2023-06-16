class MisMatchError extends Error {
	/**
	 * @type {number}
	 */
	#index = -1;

	/**
	 * Create a new MisMatch Error Instance
	 * @param {string | undefined} message 
	 * @param {number} index 
	 * @param {ErrorOptions | undefined} options 
	 * @throws {TypeError} if index is not an Integer
	 */
	constructor(message = undefined, index = -1, options = undefined) {
		if(!Number.isSafeInteger(index))
			throw new TypeError('Expected index to be an Integer');

		super(message, options);

		this.#index = index;
	}

	/**
	 * @returns {number}
	 */
	get index() {
		return this.#index;
	}
}

module.exports = MisMatchError;