const { Rule } = require('../Rule');
const { ComponentSelector } = require('./ComponentSelector');

class QuantitySelector {
	/**
	 * @type {Rule}
	 */
	#ruleInstance;

	/**
	 * Create a new Quantity Selector
	 * @param {Rule} ruleInstance 
	 */
	constructor(ruleInstance) {
		if (!(ruleInstance instanceof Rule))
			throw new TypeError('Expected ruleInstance to be a Rule');

		this.#ruleInstance = ruleInstance;
	}

	/**
	 * Set the Match Quantity to One
	 * @returns {ComponentSelector}
	 */
	one() {
		return new ComponentSelector(this.#ruleInstance, false, false);
	}

	/**
	 * Set the Match Quantity to Zero or One
	 * @returns {ComponentSelector}
	 */
	zeroOrOne() {
		return new ComponentSelector(this.#ruleInstance, false, true);
	}

	/**
	 * Set the Match Quantity to Zero or More
	 * @returns {ComponentSelector}
	 */
	zeroOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, true);
	}

	/**
	 * Set the Match Quantity to One or More
	 * @returns {ComponentSelector}
	 */
	oneOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, false);
	}
}

module.exports = { QuantitySelector };