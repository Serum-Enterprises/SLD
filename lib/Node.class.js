const Util = require('./Util.class');


class Node {
	#data;
	#range;
	#location;

	static createNode(precedingNode, data, codeString) {
		if(typeof codeString !== 'string')
			throw new TypeError('Expected codeString to be a string');

		if(precedingNode instanceof Node) 
			return new Node(
				data,
				new Range(precedingNode.range.end + 1, precedingNode.range.end + codeString.length),
				Location.calculateLocation(precedingNode.location, codeString)
			);
		else if(precedingNode === null)
			return new Node(
				data,
				new Range(0, codeString.length - 1),
				Location.calculateLocation(null, codeString)
			);
		else
			throw new TypeError('Expected precedingNode to be null or an instance of Node');
	}

	constructor(data, range, location) {
		if (!Util.isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (!(range instanceof Range))
			throw new TypeError('Expected range to be an instance of Range');

		if (!(location instanceof Location))
			throw new TypeError('Expected location to be an instance of Location');

		this.#data = data;
		this.#range = range;
		this.#location = location;
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

	clone() {
		return new Node(Util.cloneJSON(this.#data), this.#range.clone(), this.#location.clone());
	}

	toJSON() {
		return {
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