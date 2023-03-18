const { Meta } = require('./Meta.class');

class TYPE {
	/**
	 * @returns {number}
	 */
	static get SUCCESS() { return 0; }
	/**
	 * @returns {number}
	 */
	static get ERROR() { return 1; }
	/**
	 * @returns {number}
	 */
	static get RECOVER() { return 2; }

	/**
	 * @returns {number}
	 */
	static get size() {
		return 3;
	}
}

class Node {
	/**
	 * @type {number}
	 */
	#type;
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

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return new Node(data, raw, Meta.createMeta(raw));
	}

	/**
	 * Create a new Node based on the given data, raw string and Meta.
	 * @param {number} type
	 * @param {unknown} data 
	 * @param {string} raw 
	 * @param {Meta} meta 
	 */
	constructor(type, data, raw, meta) {
		// TODO: Add data type checking

		if(!Number.isSafeInteger(type) || type < 0 || type >= TYPE.size)
			throw new TypeError('Expected type to be an Integer between 0 and 2');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		if (!(meta instanceof Meta))
			throw new TypeError('Expected meta to be a Meta');

		this.#type = type;
		this.#data = data;
		this.#raw = raw;
		this.#meta = meta;
	}

	get type() {
		return this.#type;
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
	calculateNode(type, data, raw) {
		// TODO: Add data type checking

		if(!Number.isSafeInteger(type) || type < 0 || type >= TYPE.size)
			throw new TypeError('Expected type to be an Integer between 0 and 2');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return new Node(data, raw, this.#meta.calculateMeta(raw));
	}

	/**
	 * Perform a deep clone of the Node.
	 * @returns {Node}
	 */
	clone() {
		return new Node(this.#type, this.#data, this.#raw, this.#meta.clone());
	}

	/**
	 * Returns a JSON representation of the Node.
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			type: this.#type,
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

module.exports = { Node, TYPE };