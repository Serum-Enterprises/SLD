const Core = require('../../Core');

const { CustomError } = require('../../Core/src/errors/CustomError');

class Rule extends Core.Rule {
	/**
	 * Parse the Rule and return the Node that was parsed
	 * @param {string} source 
	 * @param {Core.Node | null} precedingNode 
	 * @param {Core.Grammar} grammarContext
	 * @returns {Core.Node | null}
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
		let namedNodes = {};

		// If a Custom Throw Message was set, throw an Error
		if (this.throwMessage)
			throw new CustomError(this.throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		// Attempt to parse all SymbolSets in the Rule
		try {
			for (let i = 0; i < this.symbolSets.length; i++) {
				try {
					const result = this.symbolSets[i].parse(rest, currentPrecedingNode, grammarContext);

					// Update Rest, namedNodes and currentPrecedingNode
					({ rest, namedNodes, currentPrecedingNode } = { ...result, namedNodes: Core.Node.mergeNodeMaps([namedNodes, result.namedNodes]) });

					// If the SymbolSet is greedy, try to match until it throws an Error
					if (this.symbolSets[i].greedy) {
						while (true) {
							try {
								const result = this.symbolSets[i].parse(rest, currentPrecedingNode, grammarContext);

								// Update Rest, namedNodes and currentPrecedingNode
								({ rest, namedNodes, currentPrecedingNode } = { ...result, namedNodes: Core.Node.mergeNodeMaps([namedNodes, result.namedNodes]) })
							}
							catch (error) {
								break;
							}
						}
					}
				}
				catch (error) {
					if (this.symbolSets[i].optional)
						continue;

					// If the optional Flag is not set, propagate the Error to the caller.
					throw error;
				}
			}
		}
		catch (error) {
			// If there was an Error and a recoverSymbol was set, attempt to recover, otherwise propagate the Error
			if (this.recoverSymbol) {
				result = this.recoverSymbol.find(source, currentPrecedingNode, grammarContext);

				// If the recoverSymbol was found, return the Node
				if (result)
					return result;
			}

			throw error;
		}

		// Construct the Node and return it
		const raw = source.slice(0, source.length - rest.length);
		let result = precedingNode ?
			precedingNode.createFollower('MATCH', raw, namedNodes) :
			new Core.Node('MATCH', raw, namedNodes, [0, raw.length - 1]);

		// Transform the given Node if a transformer was set
		if (this.transformer) {
			result = this.transformer(result);

			if (!(result instanceof Core.Node))
				throw new TypeError('Expected transformer to return an instance of Node');
		}

		return result;
	}
}

module.exports = { Rule };