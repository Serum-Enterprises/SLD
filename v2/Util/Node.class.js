const Util = require('./Util.class');

class Node {
	#type;
	#data;
	#range;
	#location;

	constructor(type, data, range, location) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a string');

		if (!JSONUtil.isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (!(range instanceof Range))
			throw new TypeError('Expected range to be an instance of Range');

		if (!(location instanceof Location))
			throw new TypeError('Expected location to be an instance of Location');

		this.#type = type;
		this.#data = data;
		this.#range = range;
		this.#location = location;
	}

	get type() {
		return this.#type;
	}

	get data() {
		return Util.cloneJSON(this.#data);
	}

	get range() {
		return this.#range;
	}

	get location() {
		return this.#location;
	}

	toJSON() {
		return {
			type: this.#type,
			data: Util.cloneJSON(this.#data),
			range: this.#range.toJSON(),
			location: this.#location.toJSON()
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Node;