const { RuleSet: RuleSetDC, Rule: RuleDC, Node } = require('../../Core');

class RuleSet extends RuleSetDC {
	/**
	 * Create a new RuleSet Instance
	 * @param {RuleDC[]} rules 
	 * @returns {RuleSet}
	 */
	static create(rules = []) {
		return new RuleSet(rules);
	}

	/**
	 * Set a Transformer function for this RuleSet
	 * @param {(node: Node) => Node} transformer 
	 * @returns {RuleSet}
	 */
	transform(transformer) {
		if (typeof transformer !== 'function')
			throw new TypeError('Expected transformer to be a Function');

		this.transformer = transformer;

		return this;
	}
}

module.exports = { RuleSet };