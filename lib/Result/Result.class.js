const Node = require('./Node/Node.class');

class Result {
	/**
	 * @type {Node}
	 */
	#node;
	/**
	 * @type {string}
	 */
	#rest;

	/**
	 * @returns {typeof Node}
	 */
	static get Node() {
		return Node;
	}

	/**
	 * Create a new Result based on the given Node and rest string.
	 * @param {Node} node 
	 * @param {string} rest 
	 */
	constructor(node, rest) {
		if (!(node instanceof Node))
			throw new TypeError('Expected node to be an instance of Node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a string');

		this.#node = node;
		this.#rest = rest;
	}

	/**
	 * @returns {Node}
	 */
	get node() {
		return this.#node;
	}

	/**
	 * @returns {string}
	 */
	get rest() {
		return this.#rest;
	}

	/**
	 * Perform a deep clone of this Result.
	 * @returns {Result}
	 */
	clone() {
		return new Result(this.#node.clone(), this.#rest);
	}

	/**
	 * Returns a JSON representation of this Result.
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			node: this.#node.toJSON(),
			rest: this.#rest
		};
	}

	/**
	 * Returns a string representation of this Result with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Result;