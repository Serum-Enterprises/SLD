const { Grammar, RuleSet, Rule, SymbolSet, BaseSymbol, Node } = require('../../Core');

const { MisMatchError } = require('./errors/MisMatchError');
const { CustomError } = require('./errors/CustomError');
const { RuleSetError } = require('./errors/RuleSetError');
const { EmptyStringError } = require('./errors/EmptyStringError');

class Parser {
	/**
	 * @type {Grammar}
	 */
	#grammar;

	/**
	 * Merge an Array of NodeMaps into a single NodeMap
	 * @param {{[key: string]: Node[]}[]} nodeMaps
	 * @returns {{[key: string]: Node[]}}
	 */
	static mergeNodeMaps(nodeMaps) {
		if (!Array.isArray(nodeMaps))
			throw new TypeError('Expected nodeMaps to be an Array');

		const result = {};

		nodeMaps.forEach((nodeMap, nodeMapIndex) => {
			if (Object.prototype.toString.call(nodeMap) !== '[object Object]')
				throw new TypeError(`Expected nodeMaps[${nodeMapIndex}] to be an Object`);

			Object.entries(nodeMap).forEach(([key, value]) => {
				if (!Array.isArray(result[key]))
					result[key] = [];

				if (!Array.isArray(value))
					throw new TypeError(`Expected nodeMaps[${nodeMapIndex}].${key} to be an Array`);

				value.forEach((node, nodeIndex) => {
					if (!(node instanceof Node))
						throw new TypeError(`Expected nodeMaps[${nodeMapIndex}].${key}[${nodeIndex}] to be an instance of Node`);

					result[key].push(node);
				});
			});
		});

		return result;
	}

	/**
	 * Create a new Parser Instance
	 * @param {Grammar} grammar
	 */
	constructor(grammar) {
		if (!(grammar instanceof Grammar))
			throw new TypeError('Expected grammar to be an instance of Grammar');

		this.#grammar = grammar;
	}

	/**
	 * Find a BaseSymbol in the source and return a Recovery Node or null
	 * @param {BaseSymbol} baseSymbol 
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @returns {Node | null}
	 */
	findBaseSymbol(baseSymbol, source, precedingNode) {
		if (!(baseSymbol instanceof BaseSymbol))
			throw new TypeError('Expected baseSymbol to be an instance of BaseSymbol');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		let rest = source;
		let result = null;

		while (result === null && rest.length > 0) {
			try {
				result = this.parseBaseSymbol(baseSymbol, rest, precedingNode);
			}
			catch (error) {
				if(error instanceof EmptyStringError)
					return null;

				rest = rest.slice(1);
			}
		}

		if (!result)
			return null;

		const raw = source.slice(0, source.length - rest.length + result.raw.length);

		if (precedingNode)
			return precedingNode.createFollower('RECOVER', raw, {});

		return new Node('RECOVER', raw, {}, [0, raw.length - 1]);
	}

	/**
	 * Parse a BaseSymbol
	 * @param {BaseSymbol} baseSymbol 
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @returns {Node}
	 */
	parseBaseSymbol(baseSymbol, source, precedingNode) {
		if (!(baseSymbol instanceof BaseSymbol))
			throw new TypeError('Expected baseSymbol to be an instance of BaseSymbol');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		switch (baseSymbol.type) {
			case 'STRING': {
				if (!source.startsWith(baseSymbol.value))
					throw new MisMatchError(`Expected ${baseSymbol.value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

				if (precedingNode)
					return precedingNode.createFollower('MATCH', baseSymbol.value, {});

				return new Node('MATCH', baseSymbol.value, {}, [0, baseSymbol.value.length - 1]);
			}
			case 'REGEXP': {
				const match = source.match(new RegExp(baseSymbol.value.startsWith('^') ? baseSymbol.value : `^${baseSymbol.value}`));

				if (!match)
					throw new MisMatchError(`Expected /^${baseSymbol.value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

				if (match[0].length === 0)
					throw new EmptyStringError();

				if (precedingNode)
					return precedingNode.createFollower('MATCH', match[0], {});

				return new Node('MATCH', match[0], {}, [0, match[0].length - 1]);
			}
			case 'RULESET': {
				try {
					const result = this.parseRuleSet(this.#grammar.ruleSets[baseSymbol.value], source, precedingNode);

					if (precedingNode)
						return precedingNode.createFollower('MATCH', result.raw, result.children)

					return new Node('MATCH', result.raw, result.children, [0, result.raw.length - 1]);
				}
				catch (error) {
					if (error instanceof RuleSetError)
						throw new MisMatchError(`Expected RuleSet "${baseSymbol.value}"`, precedingNode ? precedingNode.range[1] + 1 : 0);

					throw error;
				}
			}
		}
	}

	/**
	 * Parse a SymbolSet and return the rest of the source String, the named Nodes and the last Node that was parsed
	 * @param {SymbolSet} symbolSet 
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @returns {{rest: string, namedNodes: {[key: string]: Node[]}, currentPrecedingNode: Node | null}}
	 */
	parseSymbolSet(symbolSet, source, precedingNode) {
		if (!(symbolSet instanceof SymbolSet))
			throw new TypeError('Expected symbolSet to be an instance of SymbolSet');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		let rest = source;
		let currentPrecedingNode = precedingNode;
		const namedNodes = {};

		// Match every Symbol in the SymbolSet
		for (let baseSymbol of symbolSet.symbols) {
			let result = null;

			try {
				result = this.parseBaseSymbol(baseSymbol, rest, currentPrecedingNode);
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

	/**
	 * Parse a Rule and return the Node that was parsed
	 * @param {Rule} rule 
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @returns {Node | null}
	 */
	parseRule(rule, source, precedingNode) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be an instance of Rule');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		let rest = source;
		let currentPrecedingNode = precedingNode;
		let namedNodes = {};

		// If a Custom Throw Message was set, throw an Error
		if (rule.throwMessage)
			throw new CustomError(rule.throwMessage, precedingNode ? precedingNode.range[1] + 1 : 0);

		// Attempt to parse all SymbolSets in the Rule
		try {
			for (let symbolSet of rule.symbolSets) {
				try {
					const result = this.parseSymbolSet(symbolSet, rest, currentPrecedingNode);

					// Update Rest, namedNodes and currentPrecedingNode
					({ rest, namedNodes, currentPrecedingNode } = { ...result, namedNodes: Parser.mergeNodeMaps([namedNodes, result.namedNodes]) });

					// If the SymbolSet is greedy, try to match until it throws an Error
					if (symbolSet.greedy) {
						while (true) {
							try {
								const result = this.parseSymbolSet(symbolSet, rest, currentPrecedingNode);

								// Update Rest, namedNodes and currentPrecedingNode
								({ rest, namedNodes, currentPrecedingNode } = { ...result, namedNodes: Parser.mergeNodeMaps([namedNodes, result.namedNodes]) })
							}
							catch (error) {
								break;
							}
						}
					}
				}
				catch (error) {
					if (symbolSet.optional)
						continue;

					// If the optional Flag is not set, propagate the Error to the caller.
					throw error;
				}
			}
		}
		catch (error) {
			// If there was an Error and a recoverSymbol was set, attempt to recover, otherwise propagate the Error
			if (rule.recoverSymbol) {
				const result = this.findBaseSymbol(rule.recoverSymbol, source, precedingNode);

				// If the recoverSymbol was found, return the Node
				if (result)
					return result;
			}

			throw error;
		}

		// TODO: Add Transformer Function support

		// Construct the Node and return it
		const raw = source.slice(0, source.length - rest.length);
		let result = precedingNode ?
			precedingNode.createFollower('MATCH', raw, namedNodes) :
			new Node('MATCH', raw, namedNodes, [0, raw.length - 1]);

		// Transform the given Node if a transformer was set
		if (rule.transformer) {
			result = rule.transformer(result);

			if (!(result instanceof Node))
				throw new TypeError('Expected transformer to return an instance of Node');
		}

		return result;
	}

	/**
	 * Parse a RuleSet and return the Node that was parsed
	 * @param {RuleSet} ruleSet 
	 * @param {string} source 
	 * @param {Node | null} precedingNode 
	 * @returns {Node}
	 */
	parseRuleSet(ruleSet, source, precedingNode) {
		if (!(ruleSet instanceof RuleSet))
			throw new TypeError('Expected ruleSet to be an instance of RuleSet');

		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		let result = null;

		for (let i = 0; i < ruleSet.rules.length; i++) {
			try {
				result = this.parseRule(ruleSet.rules[i], source, precedingNode);
				break;
			}
			catch (error) { }
		}

		if (!result)
			throw new RuleSetError();

		// Transform the given Node if a transformer was set
		if (ruleSet.transformer) {
			result = ruleSet.transformer(result);

			if (!(result instanceof Node))
				throw new TypeError('Expected transformer to return an instance of Node');
		}

		return result;
	}

	/**
	 * Parse a source String
	 * @param {string} source 
	 * @param {string} rootRuleSet 
	 * @param {boolean} failOnRest 
	 * @param {Node | null} precedingNode 
	 * @returns {Node}
	 */
	parse(source, rootRuleSet, failOnRest = false, precedingNode = null) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (typeof rootRuleSet !== 'string')
			throw new TypeError('Expected rootRuleSet to be a String');

		if (typeof failOnRest !== 'boolean')
			throw new TypeError('Expected failOnRest to be a Boolean');

		if (!(precedingNode instanceof Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(this.#grammar.ruleSets[rootRuleSet] instanceof RuleSet))
			throw new ReferenceError(`Expected rootRuleSet to be an existing RuleSet`);

		try {
			const result = this.parseRuleSet(this.#grammar.ruleSets[rootRuleSet], source, precedingNode);

			if (failOnRest && result.raw !== source)
				throw new MisMatchError('Expected End of File', result.range[1] + 1);

			return result;
		}
		catch (error) {
			if (error instanceof RuleSetError)
				throw new MisMatchError(`Expected RuleSet "${rootRuleSet}"`, precedingNode ? precedingNode.range[1] + 1 : 0);

			throw error;
		}
	}
}

module.exports = { Parser };