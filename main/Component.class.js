const Node = require('../lib/Node.class');
const Result = require('../lib/Result.class');

class Component {
	/**
	 * @type {(input: string, precedingNode: Node | null, parentRule: Rule) => Result | null}
	 */
	#matchFunction;
	/**
	 * @type {string | null}
	 */
	#varName;

	/**
	 * Create a new Component
	 * @param {(input: string, precedingNode: Node | null, parentRule: Rule) => Result | null} matchFunction 
	 * @param {string | null} varName
	 */
	constructor(matchFunction, varName = null) {
		if (typeof matchFunction !== 'function')
			throw new TypeError('Expected matchFunction to be a Function');

		if (varName !== null && typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String or null');

		this.#matchFunction = matchFunction;
		this.#varName = varName;
	}

	get matchFunction() {
		return this.#matchFunction;
	}

	get varName() {
		return this.#varName;
	}

	static matchString(string, varName = null) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		if (varName !== null && typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String or null');

		return new Component((input, precedingNode, parentRule) => {
			if (typeof input !== 'string')
				throw new TypeError('Expected input to be a String');

			if (precedingNode !== null && !(precedingNode instanceof Node))
				throw new TypeError('Expected precedingNode to be a Node or null');

			if (!(parentRule instanceof Rule))
				throw new TypeError('Expected parentRule to be a Rule');

			if (!input.startsWith(string))
				return null;

			return new Result(new Node(string, precedingNode, parentRule), input.slice(string.length));
		}, varName);
	}

	static matchRegex(regex, varName = null) {
		if (!(regex instanceof RegExp))
			throw new TypeError('Expected regex to be a RegExp');

		if (varName !== null && typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String or null');

		return new Component((input, precedingNode, parentRule) => {
			if (typeof input !== 'string')
				throw new TypeError('Expected input to be a String');

			if (precedingNode !== null && !(precedingNode instanceof Node))
				throw new TypeError('Expected precedingNode to be a Node or null');

			if (!(parentRule instanceof Rule))
				throw new TypeError('Expected parentRule to be a Rule');

			const match = regex.exec(input);

			if (match === null)
				return null;

			return new Result(new Node(match[0], precedingNode, parentRule), input.slice(match[0].length));
		}, varName);
	}

	static matchRuleSet(name, varName) {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (varName !== null && typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String or null');

		return new Component((input, precedingNode, parentRule) => {
			if (typeof input !== 'string')
				throw new TypeError('Expected input to be a String');

			if (precedingNode !== null && !(precedingNode instanceof Node))
				throw new TypeError('Expected precedingNode to be a Node or null');

			if (!(parentRule instanceof Rule))
				throw new TypeError('Expected parentRule to be a Rule');

			const ruleSet = parentRule.parentRuleSet.parentParser.getRuleSet(name);

			const result = ruleSet.execute(input, precedingNode);

			if (result === null)
				return null;

			return new Result(result.node, result.remainingInput);
		}, varName);
	}
}

module.exports = Component;