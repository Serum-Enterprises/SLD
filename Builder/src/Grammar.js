const { Grammar: GrammarDC } = require('../../lib/src/Grammar');
const { RuleSet: RuleSetDC } = require('../../lib/src/RuleSet');

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