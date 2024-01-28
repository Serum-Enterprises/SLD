const { RuleSet } = require('./RuleSet.js');

class Grammar {
	#ruleSets;

	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: RuleSet}} [ruleSets = {}]
	 */
	constructor(ruleSets = {}) {
		if (Object.prototype.toString.call(ruleSets) !== '[object Object]')
			throw new TypeError('Expected ruleSets to be an Object');

		Object.entries(ruleSets).forEach(([name, ruleSet]) => {
			if (!(ruleSet instanceof RuleSet))
				throw new TypeError(`Expected ruleSets.${name} to be an instance of RuleSet`);
		});

		this.#ruleSets = ruleSets;
	}

	/**
	 * Get the rules of this Grammar
	 */
	get ruleSets() {
		return this.#ruleSets;
	}

	/**
	 * Set the rules of this Grammar
	 * @param {{[key: string]: RuleSet}} value
	 */
	set ruleSets(value) {
		if (Object.prototype.toString.call(value) !== '[object Object]')
			throw new TypeError('Expected value to be an Object');

		Object.entries(value).forEach(([name, ruleSet]) => {
			if (!(ruleSet instanceof RuleSet))
				throw new TypeError(`Expected value.${name} to be an instance of RuleSet`);
		});

		this.#ruleSets = value;
	}

	/**
	 * Return Debug Information about this Grammar
	 * @returns {unknown}
	 */
	debug() {
		return Object.entries(this.#ruleSets).reduce((ruleSets, [name, ruleSet]) => {
			return { ...ruleSets, [name]: ruleSet.debug() };
		}, {});
	}
}

module.exports = { Grammar };