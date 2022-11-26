const Node = require('./Node.class');

class Result {}

class ErrorResult extends Result {
	#error;

	constructor(error) {
		super();

		if (!(error instanceof Error))
			throw new TypeError('Expected error to be an instance of Error');

		this.#error = error;
	}

	get error() {
		return this.#error;
	}
}

class SuccessResult extends Result {
	#type;
	#node;
	#rest;

	constructor(type, node, rest) {
		super();

		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a string');

		if (!(node instanceof Node))
			throw new TypeError('Expected node to be an instance of Node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a string');

		this.#type = type;
		this.#node = node;
		this.#rest = rest;
	}

	get type() {
		return this.#type;
	}

	get node() {
		return this.#node;
	}

	get rest() {
		return this.#rest;
	}

	toJSON() {
		return {
			type: this.#type,
			node: this.#node.toJSON(),
			rest: this.#rest
		};
	}

	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = {Result, ErrorResult, SuccessResult};