const { Interface } = require('./Interface.class');
const { Meta } = require('./Meta.class');
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

class Node extends Interface {
	/**
	 * Checks if the given value is correct
	 * @param {MetaInterface} value
	 * @returns {boolean}
	 */
	static is(value) {
		try {
			Node.verify(value);
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Check if a given value is correct and throw an error if not
	 * @param {NodeInterface} value
	 * @param {string} [varName="value"]
	 * @returns {void}
	 */
	static verify(value, varName = 'value') {
		if (!Object.prototype.toString.call(value) === '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (typeof value.type !== 'string' || !["SUCCESS", "ERROR", "RECOVER"].includes(value.type.toUpperCase()))
			throw new TypeError(`Expected ${varName}.type to be "SUCCESS", "ERROR" or "RECOVER"`);

		if (!Util.isJSON(value.data))
			throw new TypeError(`Expected ${varName}.data to be valid JSON`);

		if(typeof value.raw !== 'string')
			throw new TypeError(`Expected ${varName}.raw to be a String`);

		Meta.verify(value.meta, `${varName}.meta`);	
	}

	/**
	 * Create a Node based on a type, data and raw string
	 * @param {string} type
	 * @param {JSON_T} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 */
	static createNode(type, data, raw) {
		if (typeof type !== 'string' || !["SUCCESS", "ERROR", "RECOVER"].includes(type.toUpperCase()))
			throw new TypeError('Expected type to be "SUCCESS", "ERROR" or "RECOVER"');

		if (!Util.isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return {
			type: type.toUpperCase(),
			data: JSON.clone(data),
			raw: raw,
		};
	}

	/**
	 * Calculate the Node based on the given data and raw string.
	 * @param {NodeInterface} previousNode
	 * @param {JSON_T} data 
	 * @param {string} raw 
	 * @returns {NodeInterface}
	 */
	static calculateNode(previousNode, type, data, raw) {
		Node.verify(previousNode, 'previousNode');

		if (typeof type !== 'string' || !["SUCCESS", "ERROR", "RECOVER"].includes(type.toUpperCase()))
			throw new TypeError('Expected type to be "SUCCESS", "ERROR" or "RECOVER"');

		if(!Util.isJSON(data))
			throw new TypeError('Expected data to be valid JSON');

		if (typeof raw !== 'string')
			throw new TypeError('Expected raw to be a String');

		return {
			type: type.toUpperCase(),
			data: JSON.clone(data),
			raw: raw,
			meta: Meta.calculateMeta(previousNode.meta, raw)
		};
	}
}

module.exports = { Node };