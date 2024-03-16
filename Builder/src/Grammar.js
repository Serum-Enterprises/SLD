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
}

module.exports = { Grammar };