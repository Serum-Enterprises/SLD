const { Node } = require('./Node.class');
const { Util } = require('./Util.class');

/**
 * @typedef {{start: number, end: number}} RangeInterface
 * @typedef {{line: number, column: number}} PositionInterface
 * @typedef {{start: PositionInterface, end: PositionInterface}} LocationInterface
 * @typedef {{location: LocationInterface, range: RangeInterface}} MetaInterface
 * @typedef {null | boolean | number | string | Array<JSON_T> | {[string]: JSON_T}} JSON_T
 * @typedef {("SUCCESS", "ERROR", "RECOVER")} NodeType_Enum
 * @typedef {{type: NodeType_Enum, data: JSON_T, raw: string, meta: MetaInterface}} NodeInterface
 */

class Result {
	/**
	 * @type {NodeInterface}
	 */
	#node;
	/**
	 * @type {string}
	 */
	#rest;

	/**
	 * Create a new Result based on the given Node and rest string.
	 * @param {NodeInterface} node 
	 * @param {string} rest 
	 */
	constructor(node, rest) {
		Node.verify(node, 'node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a string');

		this.#node = node;
		this.#rest = rest;
	}

	/**
	 * @returns {NodeInterface}
	 */
	get node() {
		return Util.clone(this.#node);
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
		return new Result(Util.clone(this.#node), this.#rest);
	}

	/**
	 * Returns a JSON representation of this Result.
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			node: Util.clone(this.#node),
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

module.exports = { Result };