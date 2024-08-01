const Parser = require('../../Parser');

class Grammar extends Parser.Grammar {
	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: Parser.RuleSet}} ruleSets 
	 * @returns {Grammar}
	 */
	static create(ruleSets = {}) {
		return new Grammar(ruleSets);
	}

	/**
	 * Register a new RuleSet with the Grammar
	 * @param {string} name 
	 * @param {Parser.RuleSet} ruleSet 
	 */
	register(name, ruleSet) {
		this.ruleSets[name] = ruleSet;
	}
}

module.exports = { Grammar };