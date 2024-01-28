const { Grammar: GrammarDC, RuleSet: RuleSetDC } = require('../../Core');

class Grammar extends GrammarDC {
	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: RuleSetDC}} ruleSets 
	 * @returns {Grammar}
	 */
	static create(ruleSets = {}) {
		return new Grammar(ruleSets);
	}
}

module.exports = { Grammar };