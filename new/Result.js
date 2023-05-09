const Node = require('./Node');
const Util = require('./Util');

/**
 * @typedef {{type: 'OK', node: Node.NodeInterface, rest: string} | {type: 'ERROR', message: string}} ResultInterface
 */

class Result {
	/**
	 * Verify that result is a valid Result Object
	 * @param {ResultInterface} result 
	 * @param {string} varName
	 * @static 
	 */
	static verify(result, varName = 'result') {
		if (Object.prototype.toString.call(result) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		// Verify result.type
		{
			if (typeof result.type !== 'string')
				throw new TypeError(`Expected ${varName}.type to be a String`);
		}

		// Branch based on result.type
		switch (result.type) {
			case 'OK': {
				Node.verify(result.node, `${varName}.node`);

				if (typeof result.rest !== 'string')
					throw new TypeError(`Expected ${varName}.rest to be a String`);
			}
				break;
			case 'ERROR': {
				if (typeof result.message !== 'string')
					throw new TypeError(`Expected ${varName}.message to be a String`);

				if (result.message.length === 0)
					throw new RangeError(`Expected ${varName}.message to be a non-empty String`);
			}
				break;
			default:
				throw new RangeError(`Expected ${varName}.type to be either "OK" or "ERROR"`);
		}
	}

	/**
	 * Check if result is a valid Result
	 * @param {ResultInterface} result 
	 * @returns {boolean}
	 */
	static check(result) {
		try {
			Result.verify(result, 'result');
			return true;
		}
		catch (error) {
			return false;
		}
	}

	/**
	 * Create a new Result Object
	 * @param {'MATCH' | 'RECOVER'} nodeType 
	 * @param {Node.ChildNodesInterface} childNodes 
	 * @param {Util.JSONInterface} data 
	 * @param {string} raw 
	 * @param {string} rest 
	 * @returns {ResultInterface}
	 */
	static create(nodeType, childNodes, data, raw, rest) {
		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		return {
			type: 'OK',
			node: Node.create(nodeType, childNodes, data, raw),
			rest: rest
		};
	}

	/**
	 * Create a new Result Object from a Node
	 * @param {Node.NodeInterface} node 
	 * @param {string} rest 
	 * @returns {ResultInterface}
	 * @static
	 */
	static createFromNode(node, rest) {
		Node.verify(node, 'node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		return {
			type: 'OK',
			node: node,
			rest: rest
		};
	}

	/**
	 * Calculate a new Result Object based on a preceding Node
	 * @param {Node.NodeInterface} precedingNode 
	 * @param {'MATCH' | 'RECOVER'} type 
	 * @param {Node.ChildNodesInterface} childNodes 
	 * @param {Util.JSONInterface} data 
	 * @param {string} raw 
	 * @param {string} rest 
	 * @returns {ResultInterface}
	 * @static
	 */
	static calculate(precedingNode, type, childNodes, data, raw, rest) {
		Node.verify(precedingNode, 'precedingNode');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		return {
			type: 'OK',
			node: Node.calculate(precedingNode, type, childNodes, data, raw),
			rest: rest
		};
	}

	/**
	 * Calculate a new Result Object from a Node based on a preceding Node
	 * @param {Node.NodeInterface} precedingNode 
	 * @param {Node.NodeInterface} node 
	 * @param {string} rest 
	 * @returns {ResultInterface}
	 * @static
	 */
	static calculateFromNode(precedingNode, node, rest) {
		Node.verify(precedingNode, 'precedingNode');
		Node.verify(node, 'node');

		if (typeof rest !== 'string')
			throw new TypeError('Expected rest to be a String');

		return {
			type: 'OK',
			node: Node.calculate(precedingNode, node.type, node.childNodes, node.data, node.raw),
			rest: rest
		};
	}

	/**
	 * Create a new Error Result Object
	 * @param {string} message 
	 * @returns {ResultInterface}
	 * @static
	 */
	static error(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		if (message.length === 0)
			throw new RangeError('Expected message to be a non-empty String');

		return {
			type: 'ERROR',
			message: message
		};
	}

	/**
	 * Get the raw String from two Results
	 * @param {ResultInterface} firstResult 
	 * @param {ResultInterface} lastResult 
	 * @returns {string}
	 * @static
	 */
	static getRaw(firstResult, lastResult) {
		return firstResult.node.raw + firstResult.rest.slice(0, firstResult.rest.length - lastResult.rest.length);
	}
}

module.exports = Result;