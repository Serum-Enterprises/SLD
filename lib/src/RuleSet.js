const { Rule } = require('./Rule.js');

class RuleSet {
	#rules;

	/**
	 * Create a new RuleSet Instance
	 * @param {Rule[]} [rules = []]
	 */
	constructor(rules = []) {
		if (!Array.isArray(rules))
			throw new TypeError('Expected rules to be an Array');

		rules.forEach((rule, index) => {
			if (!(rule instanceof Rule))
				throw new TypeError(`Expected rules[${index}] to be an instance of Rule`);
		});

		this.#rules = rules;
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
	 * Return Debug Information about this RuleSet
	 * @returns {unknown}
	 */
	debug() {
		return {
			rules: this.#rules.map(rule => rule.debug())
		}
	}
}

module.exports = { RuleSet };