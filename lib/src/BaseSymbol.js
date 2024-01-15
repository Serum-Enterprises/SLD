class BaseSymbol {
	#type;
	#value;
	#name;

	/**
	 * Create a new BaseSymbol Instance from JSON Data
	 * @param {unknown} data 
	 * @param {string} [name = "data"] 
	 * @returns {BaseSymbol}
	 */
	static fromJSON(data, name = 'data') {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		if (typeof data.type !== 'string')
			throw new TypeError(`Expected ${name}.type to be a String`);

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(data.type.toUpperCase()))
			throw new RangeError(`Expected ${name}.type to be one of "STRING", "REGEXP", "VARIANT"`);

		if (typeof data.value !== 'string')
			throw new TypeError(`Expected ${name}.value to be a String`);

		if (!(typeof data.name === 'string' || data.name === null))
			throw new TypeError(`Expected ${name}.name to be a String or null`);

		return new BaseSymbol(data.type, data.value, data.name);
	}

	/**
	 * Create a new BaseSymbol Instance
	 * @param {"STRING" | "REGEXP" | "VARIANT"} type 
	 * @param {string} value 
	 * @param {string | null} [name = null] 
	 */
	constructor(type, value, name = null) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(type.toUpperCase()))
			throw new RangeError('Expected type to be one of "STRING", "REGEXP", "VARIANT"');

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
	 * @returns {"STRING" | "REGEXP" | "VARIANT"}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Set the type of this BaseSymbol
	 * @param {"STRING" | "REGEXP" | "VARIANT"} value
	 */
	set type(value) {
		if (typeof value !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(value.toUpperCase()))
			throw new RangeError('Expected type to be one of "STRING", "REGEXP", "VARIANT"');

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
	
	/**
	 * Convert this BaseSymbol Instance to JSON Data
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
			name: this.#name
		};
	}
}

module.exports = { BaseSymbol }