const Core = require('../../Core');

const { EmptyStringError } = require('../../Core/src/errors/EmptyStringError');

class SymbolSet extends Core.SymbolSet {
	/**
	 * Parse this SymbolSet and return the rest of the source String, the named Nodes and the last Node that was parsed
	 * @param {string} source 
	 * @param {Core.Node | null} precedingNode 
	 * @param {Core.Grammar} grammarContext
	 * @returns {{rest: string, namedNodes: {[key: string]: Core.Node[]}, currentPrecedingNode: Core.Node | null}}
	 */
	parse(source, precedingNode, grammarContext) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Core.Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(grammarContext instanceof Core.Grammar))
			throw new TypeError('Expected grammarContext to be an instance of Grammar');

		let rest = source;
		let currentPrecedingNode = precedingNode;
		const namedNodes = {};

		// Match every Symbol in the SymbolSet
		for (let baseSymbol of this.symbols) {
			let result = null;

			try {
				result = baseSymbol.parse(rest, currentPrecedingNode, grammarContext);
			}
			catch (error) {
				// If the RegExp matched an empty String, do nothing and ignore the current Match
				if (error instanceof EmptyStringError)
					continue;
				else
					throw error;
			}

			// If the Symbol is named, add it to the namedNodes Object
			if (baseSymbol.name) {
				if (!Array.isArray(namedNodes[baseSymbol.name]))
					namedNodes[baseSymbol.name] = [];

				namedNodes[baseSymbol.name].push(result);
			}

			rest = rest.slice(result.raw.length);
			currentPrecedingNode = result;
		}

		return {
			rest,
			namedNodes,
			currentPrecedingNode
		}
	}
}

module.exports = { SymbolSet };