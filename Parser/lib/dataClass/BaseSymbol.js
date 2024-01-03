class BaseSymbol {
	#type;
	#value;
	#name;

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
	
	get type() {
		return this.#type;
	}

	get value() {
		return this.#value;
	}
	
	get name() {
		return this.#name;
	}
	
	toJSON() {
		return {
			type: this.#type,
			value: this.#value,
			name: this.#name
		};
	}
}

module.exports = { BaseSymbol }