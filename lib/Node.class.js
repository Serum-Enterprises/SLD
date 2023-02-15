const Util = require('./Util.class');
const {Meta} = require('./Meta');

class Node {
	/**
	 * @type {unknown}
	 */
	#data;
	/**
	 * @type {string}
	 */
	#raw;
	/**
	 * @type {Meta}
	 */
	#meta;

	/**
	 * Create a new Node based on the given data and raw string.
	 * @param {unknown} data 
	 * @param {string} raw 
	 * @returns {Node}
	 */
	static createNode(data, raw) {
		// TODO: Add data type checking

		if(typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return new Node(data, raw, Meta.createMeta(raw));
	}

	/**
	 * Create a new Node based on the given data, raw string and Meta.
	 * @param {unknown} data 
	 * @param {string} raw 
	 * @param {Meta} meta 
	 */
	constructor(data, raw, meta) {
		// TODO: Add data type checking

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		if (!(meta instanceof Meta))
			throw new TypeError('Expected meta to be a Meta');

		this.#data = data;
		this.#raw = raw;
		this.#meta = meta;
	}

	/**
	 * @returns {unknown}
	 */
	get data() {
		return this.#data;
	}

	/**
	 * @returns {string}
	 */
	get raw() {
		return this.#raw;
	}

	/**
	 * @returns {string}
	 */
	get meta() {
		return this.#meta;
	}

	/**
	 * Calculate the Node based on the given data and raw string.
	 * @param {unknown} data 
	 * @param {string} raw 
	 * @returns {Node}
	 */
	calculateNode(data, raw) {
		// TODO: Add data type checking

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return new Node(data, raw, this.#meta.calculateMeta(raw));
	}

	/**
	 * Perform a deep clone of the Node.
	 * @returns {Node}
	 */
	clone() {
		return new Node(this.#data, this.#raw, this.#meta.clone());
	}

	/**
	 * Returns a JSON representation of the Node.
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			data: this.#data,
			raw: this.#raw,
			meta: this.#meta
		};
	}

	/**
	 * Returns a string representation of the Node with the help of this.toJSON().
	 * @returns {string}
	 */
	toString() {
		return JSON.stringify(this.toJSON());
	}
}

module.exports = Node;