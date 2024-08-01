const Parser = require('../../Parser');

class RuleSet extends Parser.RuleSet {
	/**
	 * Create a new RuleSet Instance
	 * @param {Parser.Rule[]} rules 
	 * @returns {RuleSet}
	 */
	static create(rules = []) {
		return new RuleSet(rules);
	}

	/**
	 * Set a Transformer function for this RuleSet
	 * @param {(node: Parser.Node) => Parser.Node} transformer 
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