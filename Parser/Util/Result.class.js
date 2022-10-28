class Result {
	#type;
	#value;
	#rest;

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
			value: Util.cloneJSON(this.value)
		};
	}

	toString(pretty = false) {
		if(typeof pretty !== 'boolean')
			throw new TypeError('Expected pretty to be a Boolean');

		return JSON.stringify(this.JSON(), null, pretty ? '\t' : undefined);
	}
}

module.exports = Result;