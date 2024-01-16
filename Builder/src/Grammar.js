const { Grammar: GrammarDC } = require('../../../lib/src/Grammar');
const { Rule: RuleDC } = require('../../../lib/src/Rule');

class Grammar extends GrammarDC {
	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: RuleDC[]}} ruleSets 
	 * @returns {Grammar}
	 */
	static create(ruleSets = {}) {
		return new Grammar(ruleSets);
	}

	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: RuleDC[]}} ruleSets 
	 * @returns {Grammar}
	 */
	constructor(ruleSets = {}) {
		if (!Object.prototype.toString.call(ruleSets) === '[object Object]')
			throw new TypeError('Expected ruleSets to be an Object');

		Object.entries(ruleSets).forEach(([name, ruleSet]) => {
			if (!Array.isArray(ruleSet))
				throw new TypeError(`Expected ruleSets.${name} to be an Array`);

			ruleSet.forEach((rule, index) => {
				if (!(rule instanceof RuleDC))
					throw new TypeError(`Expected ruleSets.${name}[${index}] to be an instance of Rule`);
			});
		});

		super(ruleSets);
	}
}

module.exports = { Grammar };