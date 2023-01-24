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

	get() {
		return this.#value;
	}
}

module.exports = Optional;