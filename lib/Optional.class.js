class Optional {
	#value;

	/**
	 * Create a new Optional based on the given value.
	 * @param {unknown} [value] 
	 */
	constructor(value = undefined) {
		this.#value = value;
	}

	/**
	 * Returns true if the value is set.
	 * @returns {boolean}
	 */
	isSet() {
		return this.#value !== undefined;
	}

	/**
	 * Returns true if the value is set.
	 */
	get isSet() {
		return this.isSet();
	}

	/**
	 * If the value is set, returns the contained value, otherwise throws the provided error.
	 * @param {Error} error 
	 * @returns {unknown}
	 */
	expect(error) {
		if(!(error instanceof Error))
			throw new TypeError('Expected error to be an instance of Error');

		if (this.#value === undefined)
			throw error;

		return this.#value;
	}

	/**
	 * If the value is set, returns the contained value, otherwise throws an error.
	 * @param {unknown} default
	 * @returns {unknown}
	 */
	unwrap(defaultValue) {
		if (this.isNone())
			return defaultValue;

		return this.#value;
	}
}

module.exports = Optional;