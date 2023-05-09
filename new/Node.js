const Meta = require('./Meta');
const Util = require('./Util');

/**
 * @typedef {{[key: string]: (NodeInterface | NodeInterface[])}} ChildNodesInterface
 * @typedef {{type: 'MATCH' | 'RECOVER', data: Util.JSONInterface, childNodes: ChildNodesInterface, raw: string, meta: Meta.MetaInterface}} NodeInterface
 */

class Node {
	/**
	 * Verify that node is a valid Node Object.
	 * @param {NodeInterface} node - The Node Object to verify.
	 * @param {string} varName - The name of the variable to verify.
	 * @static
	 */
	static verify(node, varName = 'node') {
		if (Object.prototype.toString.call(node) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		{
			if (typeof node.type !== 'string')
				throw new TypeError(`Expected ${varName}.type to be a String`);

			if (!['MATCH', 'RECOVER'].includes(node.type))
				throw new RangeError(`Expected ${varName}.type to be either "MATCH" or "RECOVER"`);
		}

		// Verify the Child Nodes
		{
			if (Object.prototype.toString.call(node.childNodes) !== '[object Object]')
				throw new TypeError(`Expected ${varName}.childNodes to be an Object`);

			for (const [key, value] of Object.entries(node.childNodes)) {
				if (Array.isArray(value))
					value.forEach((node, index) => Node.verify(node, `${varName}.childNodes.${key}[${index}]`));
				else
					Node.verify(value, `${varName}.childNodes.${key}`);
			}
		}

		// Verify the User-Defined Data
		{
			if (!Util.isJSON(node.data))
				throw new TypeError(`Expected ${varName}.data to be valid JSON`);
		}

		// Verify the Raw String
		{
			if (typeof node.raw !== 'string')
				throw new TypeError(`Expected ${varName}.raw to be a String`);

			if (node.raw.length === 0)
				throw new RangeError(`Expected ${varName}.raw to be a non-empty String`);
		}

		// Verify the Meta Object
		{
			Meta.verify(node.meta, `${varName}.meta`);
		}
	}

	/**
	 * Check if node is a valid Node Object.
	 * @param {NodeInterface} node - The Node Object to verify.
	 * @returns {boolean} - Whether the Node Object is valid.
	 * @static
	 */
	static check(node) {
		try {
			Node.verify(node, 'node');
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Create a new Node Object.
	 * @param {'MATCH' | 'RECOVER'} type
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 * @static
	 */
	static create(type, childNodes, data, raw) {
		if (typeof type !== 'string')
			throw new TypeError(`Expected type to be a String`);

		if (!['MATCH', 'RECOVER'].includes(type))
			throw new RangeError(`Expected type to be either "MATCH" or "RECOVER"`);

		if (Object.prototype.toString.call(childNodes) !== '[object Object]')
			throw new TypeError(`Expected childNodes to be an Object`);

		for (const [key, value] of Object.entries(childNodes)) {
			if (Array.isArray(value))
				value.forEach((node, index) => Node.verify(node, `childNodes.${key}[${index}]`));
			else
				Node.verify(value, `childNodes.${key}`);
		}

		if (!Util.isJSON(data))
			throw new TypeError(`Expected data to be valid JSON`);

		if (typeof raw !== 'string')
			throw new TypeError(`Expected raw to be a String`);

		if (raw.length === 0)
			throw new RangeError(`Expected raw to be a non-empty String`);

		return {
			type,
			data,
			childNodes,
			raw,
			meta: Meta.create(raw)
		};
	}

	/**
	 * Create a new Node Object of type MATCH.
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 * @static
	 */
	static createMatch(childNodes, data, raw) {
		return Node.create('MATCH', childNodes, data, raw);
	}

	/**
	 * Create a new Node Object of type MATCH.
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 * @static
	 */
	static createRecover(childNodes, data, raw) {
		return Node.create('RECOVER', childNodes, data, raw);
	}

	/**
	 * Calculate a new Node Object based on a preceding Node Object.
	 * @param {NodeInterface} precedingNode
	 * @param {'MATCH' | 'RECOVER'} type
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 */
	static calculate(precedingNode, type, childNodes, data, raw) {
		Node.verify(precedingNode, 'precedingNode');

		if (typeof type !== 'string')
			throw new TypeError(`Expected type to be a String`);

		if (!['MATCH', 'RECOVER'].includes(type))
			throw new RangeError(`Expected type to be either "MATCH" or "RECOVER"`);

		if (Object.prototype.toString.call(childNodes) !== '[object Object]')
			throw new TypeError(`Expected childNodes to be an Object`);

		for (const [key, value] of Object.entries(childNodes)) {
			if (Array.isArray(value))
				value.forEach((node, index) => Node.verify(node, `childNodes.${key}[${index}]`));
			else
				Node.verify(value, `childNodes.${key}`);
		}

		if (!Util.isJSON(data))
			throw new TypeError(`Expected data to be valid JSON`);

		if (typeof raw !== 'string')
			throw new TypeError(`Expected raw to be a String`);

		if (raw.length === 0)
			throw new RangeError(`Expected raw to be a non-empty String`);

		return {
			type,
			data,
			childNodes,
			raw,
			meta: Meta.calculate(precedingNode.meta, raw)
		};
	}

	/**
	 * Calculate a new Node Object based on a preceding Node Object.
	 * @param {NodeInterface} precedingNode
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 */
	static calculateMatch(precedingNode, childNodes, data, raw) {
		return Node.calculate(precedingNode, 'MATCH', childNodes, data, raw);
	}

	/**
	 * Calculate a new Node Object based on a preceding Node Object.
	 * @param {NodeInterface} precedingNode
	 * @param {ChildNodesInterface} childNodes
	 * @param {Util.JSONInterface} data
	 * @param {string} raw
	 * @returns {NodeInterface}
	 */
	static calculateRecover(precedingNode, childNodes, data, raw) {
		return Node.calculate(precedingNode, 'RECOVER', childNodes, data, raw);
	}
}

module.exports = Node;