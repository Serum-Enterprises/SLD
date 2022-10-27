class Rule {
	#type;
	#value;
	#rest;

	static create(codeString) {
		throw new ReferenceError('Rule.create not implemented');
	}

	constructor(type, value, rest) {
		if(typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if(typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		if(!Util.isJSON(value))
			throw new TypeError('Expected value to be valid JSON');

		this.#type = type;
		this.#value = value;
		this.#rest = rest;
	}

	get type() {
		return this.#type;
	}

	get value() {
		return Util.cloneJSON(this.#value);
	}

	get rest() {
		return this.#rest;
	}

	toJSON() {
		return {
			type: this.type,
			value: this.value
		};
	}

	toString(pretty = false) {
		return JSON.stringify(this.JSON(), null, pretty ? '\t' : undefined);
	}
}