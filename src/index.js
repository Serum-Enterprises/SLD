const { Result } = require('../lib/Result.class');
const { Node } = require('../lib/Node.class');
const { Meta } = require('../lib/Meta');

const { ParseError, LookupError } = require('./Errors.class');
const { Component } = require('./Component.class');

class Rule {
	#rules;
	#handler;
	static #constructPrivate = true;

	constructor() {
		if (Rule.#constructPrivate)
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

		Rule.#constructPrivate = false;
		const rule = new Rule();
		Rule.#constructPrivate = true;

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
	 * @returns {Rule}
	 */
	end(handler) {
		if (typeof handler !== 'function')
			throw new TypeError('Expected handler to be a Function');

		this.#handler = handler;

		return this;
	}

	/**
	 * Add a throwing Handler to the Rule
	 * @param {string} message 
	 * @returns {Rule}
	 */
	throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#handler = () => {
			throw new ParseError(message);
		};

		return this;
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

		return JSON.parse(JSON.stringify(result.node, metaData ? function (key, value) {
			if (this[key] instanceof Meta)
				return undefined;

			return value;
		} : null, 0));
	}
}

module.exports = {
	Parser,
	RuleSet,
	Rule,
	Component,
	Error: { ParseError, LookupError }
}