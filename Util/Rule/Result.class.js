const Node = require('./Node.class');

class Result {
	#node;
	#rest;

	constructor(node, rest) {
		if (!(node instanceof Node))
			throw new TypeError('Expected node to be an instance of Node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a string');

		this.#node = node;
		this.#rest = rest;
	}

	get node() {
		return this.#node;
	}

	get rest() {
		return this.#rest;
	}

	clone() {
		return new Result(this.#node.clone(), this.#rest);
	}

	toJSON() {
		return {
			node: this.#node.toJSON(),
			rest: this.#rest
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Result;