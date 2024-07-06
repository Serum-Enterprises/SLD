class BaseSymbol {
	#type;
	#value;
	#name;

	/**
	 * Create a new BaseSymbol Instance
	 * @param {"STRING" | "REGEXP" | "RULESET"} type 
	 * @param {string} value 
	 * @param {string | null} [name = null] 
	 */
	constructor(type, value, name = null) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'RULESET'].includes(type.toUpperCase()))
			throw new RangeError('Expected type to be one of "STRING", "REGEXP", "RULESET"');

		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (typeof name !== 'string' && name !== null)
			throw new TypeError('Expected name to be a String or null');

		this.#type = type;
		this.#value = value;
		this.#name = name;
	}

	/**
	 * Get the type of this BaseSymbol
	 * @returns {"STRING" | "REGEXP" | "RULESET"}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Set the type of this BaseSymbol
	 * @param {"STRING" | "REGEXP" | "RULESET"} value
	 */
	set type(value) {
		if (typeof value !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'RULESET'].includes(value.toUpperCase()))
			throw new RangeError('Expected type to be one of "STRING", "REGEXP", "RULESET"');

		this.#type = value;
	}

	/**
	 * Get the value of this BaseSymbol
	 * @returns {string}
	 */
	get value() {
		return this.#value;
	}

	/**
	 * Set the value of this BaseSymbol
	 * @param {string} value
	 */
	set value(value) {
		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		this.#value = value;
	}

	/**
	 * Get the name of this BaseSymbol
	 * @returns {string | null}
	 */
	get name() {
		return this.#name;
	}

	/**
	 * Set the name of this BaseSymbol
	 * @param {string | null} value
	 */
	set name(value) {
		if (typeof value !== 'string' && value !== null)
			throw new TypeError('Expected name to be a String or null');

		this.#name = value;
	}
}

module.exports = { BaseSymbol }