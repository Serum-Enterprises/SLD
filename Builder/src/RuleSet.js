const { RuleSet: RuleSetDC } = require('../../lib/src/RuleSet');
const { Rule: RuleDC } = require('../../lib/src/Rule');

class RuleSet extends RuleSetDC {
	/**
	 * Create a new RuleSet Instance
	 * @param {RuleDC[]} rules 
	 * @returns {RuleSet}
	 */
	static create(rules = []) {
		return new RuleSet(rules);
	}
}

module.exports = { RuleSet };