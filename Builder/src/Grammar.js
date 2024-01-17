const { Grammar: GrammarDC } = require('../../lib/src/Grammar');
const { Rule: RuleDC } = require('../../lib/src/Rule');

class Grammar extends GrammarDC {
	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: RuleDC[]}} ruleSets 
	 * @returns {Grammar}
	 */
	static create(ruleSets = {}) {
		return new Grammar(ruleSets);
	}
}

module.exports = { Grammar };