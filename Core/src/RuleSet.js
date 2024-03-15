const { Rule } = require('./Rule.js');
const { Node } = require('./Node.js');

class RuleSet {
	#rules;
	#transformer;

	/**
	 * Create a new RuleSet Instance
	 * @param {Rule[]} [rules = []]
	 * @param {((node: Node) => Node) | null} [transformer = null]
	 */
	constructor(rules = [], transformer = null) {
		if (!Array.isArray(rules))
			throw new TypeError('Expected rules to be an Array');

		rules.forEach((rule, index) => {
			if (!(rule instanceof Rule))
				throw new TypeError(`Expected rules[${index}] to be an instance of Rule`);
		});

		if (transformer !== null && typeof transformer !== 'function')
			throw new TypeError('Expected transformer to be a Function or null');

		this.#rules = rules;
		this.#transformer = transformer;
	}

	/**
	 * Get the rules of this RuleSet
	 */
	get rules() {
		return this.#rules;
	}

	/**
	 * Set the rules of this RuleSet
	 * @param {Rule[]} value
	 */
	set rules(value) {
		if (!Array.isArray(value))
			throw new TypeError('Expected value to be an Array');

		value.forEach((rule, index) => {
			if (!(rule instanceof Rule))
				throw new TypeError(`Expected value[${index}] to be an instance of Rule`);
		});

		this.#rules = value;
	}

	/**
	 * Get the transformer of this RuleSet
	 * @returns {(node: Node) => Node}
	 */
	get transformer() {
		return this.#transformer;
	}

	/**
	 * Set the transformer of this RuleSet
	 * @param {(node: Node) => Node} value
	 */
	set transformer(value) {
		if (value !== null && typeof value !== 'function')
			throw new TypeError('Expected value to be a Function or null');

		this.#transformer = value;
	}

	/**
	 * Return Debug Information about this RuleSet
	 * @returns {unknown}
	 */
	debug() {
		return {
			rules: this.#rules.map(rule => rule.debug()),
			transformer: this.#transformer ? '[object Function]' : null
		}
	}
}

module.exports = { RuleSet };