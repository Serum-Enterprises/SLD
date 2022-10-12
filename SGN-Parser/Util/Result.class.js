const Util = require('./Util.class.js');

class Result {
	#data;
	#rest;

	constructor(rest, data) {
		if(typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		if(!Util.isJSON(data))
			throw new TypeError('Expected data to be JSON');

		this.#data = data;
		this.#rest = rest;
	}

	get rest() {
		return this.#rest;
	}

	get data() {
		return this.#data;
	}

	toJSON() {
		return {
			rest: this.rest,
			data: this.data
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Result;