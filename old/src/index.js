const { Result } = require('../../MetaLib/Result.class');
const { Node } = require('../../MetaLib/Node.class');
const { Meta } = require('../../MetaLib/Meta.class');

class ParseError extends Error {}
class LookupError extends Error {}

/**
 * @typedef {null | boolean | number | string | Array<JSON_T> | {[string]: JSON_T}} JSON_T
 * 
 * @typedef {{start: number, end: number}} RangeInterface
 * @typedef {{line: number, column: number}} PositionInterface
 * @typedef {{start: PositionInterface, end: PositionInterface}} LocationInterface
 * @typedef {{location: LocationInterface, range: RangeInterface}} MetaInterface
 * 
 * @typedef {"SUCCESS" | "ERROR" | "RECOVER"} NodeType_Enum
 * @typedef {{type: NodeType_Enum, data: JSON_T, raw: string, meta: MetaInterface}} NodeInterface
 * 
 * @typedef {(input: string, previousNode: NodeInterface, parserContext: Parser) => Result} matchFunction
 */

class Rule {
	/**
	 * @type {Array<matchFunction>}
	 */
	#rules = [];
	/**
	 * TODO
	 * @type {() => unknown | null}
	 */
	#handler = null;
	/**
	 * TODO
	 * @type {() => unknown | null}
	 */
	#recover = null;
	/**
	 * A Static Private Flag to prevent direct instantiation of Rule.
	 * @type {boolean}
	 */
	static #privateConstructor = true;

	/**
	 * Factory function to create a matchFunction that matches a string.
	 * @param {string} string 
	 * @returns {matchFunction}
	 */
	static matchString(string) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		return (input, previousNode) => {
			if (!input.startsWith(string))
				return null;

			if (precedingNode === null)
				return new Result(Node.createNode(string, string), input.slice(string.length));

			return new Result(Node.calculateNode(previosNode, string, string), input.slice(string.length));
		};
	}

	constructor() {
		if (Rule.#privateConstructor)
			throw new ReferenceError('Can only create Rule from Rule.begin()');

		this.#rules = [];
		this.#handler = null;
	}

	/**
	 * Begin a new Rule.
	 * @param {Function | string | RegExp} matchFunction
	 * @param {string | null} [varName=null]
	 * @param {boolean} [optional=false]
	 * @returns {Rule}
	 */
	static begin(matchFunction, varName = null, optional = false) {
		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof varName !== 'string' && varName !== null)
			throw new TypeError('Expected varName to be a String or null');

		Rule.#privateConstructor = false;
		const rule = new Rule();
		Rule.#privateConstructor = true;

		if (typeof matchFunction === 'function') {
			rule.directlyFollowedBy(matchFunction, varName, optional);
		}
		else if (typeof matchFunction === 'string') {
			rule.directlyFollowedBy(Component.matchString(matchFunction), varName, optional);
		}
		else if (matchFunction instanceof RegExp) {
			rule.directlyFollowedBy(Component.matchRegex(matchFunction), varName, optional);
		}
		else
			throw new TypeError('Expected matchFunction to be a Function, String or RegExp');

		return rule;
	}

	/**
	 * Create a new Rule that always throws an error.
	 * @param {unknown} error
	 * @returns {Rule}
	 */
	static throw(error) {
		Rule.#privateConstructor = false;
		const rule = new Rule();
		Rule.#privateConstructor = true;

		rule.throw(error);
		return rule;
	}

	/**
	 * Adds a matchFunction to the Rule.
	 * @param {Function | string | RegExp} matchFunction
	 * @param {string | null} [varName=null]
	 * @param {boolean} [optional=false]
	 * @returns {Rule}
	 */
	followedBy(matchFunction, varName = null, optional = false) {
		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof varName !== 'string' && varName !== null)
			throw new TypeError('Expected varName to be a String or null');

		if (typeof matchFunction === 'function') {
			this.#rules.push({ matchFunction: Component.matchWhitespace(), varName: null, optional: true });
			this.#rules.push({ matchFunction, varName, optional });
		}
		else if (typeof matchFunction === 'string') {
			this.#rules.push({ matchFunction: Component.matchWhitespace(), varName: null, optional: true });
			this.#rules.push({ matchFunction: Component.matchString(matchFunction), varName, optional });
		}
		else if (matchFunction instanceof RegExp) {
			this.#rules.push({ matchFunction: Component.matchWhitespace(), varName: null, optional: true });
			this.#rules.push({ matchFunction: Component.matchRegex(matchFunction), varName, optional });
		}
		else
			throw new TypeError('Expected matchFunction to be a Function, String or RegExp');

		return this;
	}

	/**
	 * Adds a matchFunction to the Rule.
	 * @param {Function | string | RegExp} matchFunction
	 * @param {string | null} [varName=null]
	 * @param {boolean} [optional=false]
	 * @returns {Rule}
	 */
	directlyFollowedBy(matchFunction, varName = null, optional = false) {
		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof varName !== 'string' && varName !== null)
			throw new TypeError('Expected varName to be a String or null');

		if (typeof matchFunction === 'function') {
			this.#rules.push({ matchFunction, varName, optional });
		}
		else if (typeof matchFunction === 'string') {
			this.#rules.push({ matchFunction: Component.matchString(matchFunction), varName, optional });
		}
		else if (matchFunction instanceof RegExp) {
			this.#rules.push({ matchFunction: Component.matchRegex(matchFunction), varName, optional });
		}
		else
			throw new TypeError('Expected matchFunction to be a Function, String or RegExp');

		return this;
	}

	/**
	 * Add a Handler to the Rule.
	 * @param {() => unknown)} handler
	 */
	end(handler) {
		if (typeof handler !== 'function')
			throw new TypeError('Expected handler to be a Function');

		this.#handler = handler;
	}

	/**
	 * Add a throwing Handler to the Rule
	 * @param {string} message
	 */
	throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#handler = () => {
			throw new ParseError(message);
		};
	}

	recover(matchFunction) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#handler = () => {
			return (input, precedingNode, parserContext) => {
				return new Result(precedingNode.calculateNode(match[0], match[0]), input.slice(match[0].length));
			};
			throw new ParseError(message, true);
		};
	}

	/**
	 * Execute the Rule.
	 * @param {string} input 
	 * @param {Node | null} precedingNode 
	 * @param {Parser} parserContext
	 * @returns {Result | null}
	 */
	execute(input, precedingNode, parserContext) {
		if (typeof input !== 'string')
			throw new TypeError('Expected input to be a String');

		if (precedingNode !== null && !(precedingNode instanceof Node))
			throw new TypeError('Expected precedingNode to be a Node or null');

		if (!(parserContext instanceof Parser))
			throw new TypeError('Expected parserContext to be a Parser');

		let rest = input;
		let results = [];
		let varData = {};
		let currentNode = precedingNode;

		for (const { matchFunction, varName, optional } of this.#rules) {
			const result = matchFunction(rest, currentNode, parserContext);

			if (result === null)
				if (optional)
					continue;
				else
					return null;

			if (varName !== null)
				varData[varName] = result.node;

			rest = result.rest;
			results.push(result.node);
			currentNode = result.node;
		}

		const handlerResult = this.#handler ? this.#handler.bind(varData)() : varData;

		if (precedingNode === null)
			return new Result(Node.createNode(handlerResult, results.map(node => node.raw).join('')), rest);

		return new Result(precedingNode.calculateNode(handlerResult, results.map(node => node.raw).join('')), rest);
	}
}

class RuleSet {
	#rules;

	/**
	 * Create a new RuleSet.
	 * @param {Array<Rule>} rules 
	 */
	constructor(rules) {
		if (!Array.isArray(rules) && !rules.every(rule => rule instanceof Rule))
			throw new TypeError('Expected rules to be an Array of Rules');

		this.#rules = rules;
	}

	/**
	 * Add a Rule to the RuleSet.
	 * @param {Rule} rule 
	 */
	addRule(rule) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be a Rule');

		this.#rules.push(rule);
	}

	/**
	 * Execute the RuleSet.
	 * @param {string} input 
	 * @param {Node | null} precedingNode 
	 * @param {Parser} parserContext 
	 * @returns {Result | null}
	 */
	execute(input, precedingNode, parserContext) {
		if (typeof input !== 'string')
			throw new TypeError('Expected input to be a String');

		if (precedingNode !== null && !(precedingNode instanceof Node))
			throw new TypeError('Expected precedingNode to be a Node or null');

		if (!(parserContext instanceof Parser))
			throw new TypeError('Expected parserContext to be a Parser');

		for (const rule of this.#rules) {
			const result = rule.execute(input, precedingNode, parserContext);

			if (result !== null)
				return result;
		}

		throw new ParseError('No rule matched');
	}
}

class Parser {
	/**
	 * @type {RuleSet}
	 */
	#rootRuleSet;

	/**
	 * @type {Map<string, RuleSet>}
	 */
	#ruleSets;

	/**
	 * Create a new Parser.
	 * @param {RuleSet} rootRuleSet 
	 * @param {Array<[string, RuleSet]>} ruleSets
	 */
	constructor(rootRuleSet, ruleSets = []) {
		if (!(rootRuleSet instanceof RuleSet))
			throw new TypeError('Expected rootRuleSet to be an instance of RuleSet');

		if (!(Array.isArray(ruleSets) && ruleSets.every(ruleSet => Array.isArray(ruleSet) && ruleSet.length === 2 && typeof ruleSet[0] === 'string' && ruleSet[1] instanceof RuleSet)))
			throw new TypeError('Expected ruleSets to be an Array of RuleSets');

		this.#rootRuleSet = rootRuleSet;
		this.#ruleSets = new Map(ruleSets);
	}

	has(name) {
		return this.#ruleSets.has(name);
	}

	get(name) {
		return this.#ruleSets.get(name);
	}

	set(name, ruleSet) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (!(ruleSet instanceof RuleSet))
			throw new TypeError('Expected ruleSet to be an instance of RuleSet');

		this.#ruleSets.set(name, ruleSet);
	}

	/**
	 * Execute the Parser.
	 * @param {string} input 
	 * @param {boolean} [metaData=false]
	 * @returns {unknown}
	 */
	execute(input, metaData = false) {
		if (typeof input !== 'string')
			throw new TypeError('Expected input to be a String');

		const result = this.#rootRuleSet.execute(input, null, this);

		if (result === null)
			return null;

		return JSON.parse(JSON.stringify(result.node, metaData ? null : function (key, value) {
			if (this[key] instanceof Meta)
				return undefined;

			return value;
		}, 0));
	}
}

module.exports = {
	Parser,
	RuleSet,
	Rule,
	Component,
	Error: { ParseError, LookupError }
}