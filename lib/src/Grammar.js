const { Rule } = require('./Rule.js');

class Grammar {
	#rules;

	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: Rule[]}} [rules = {}]
	 */
	constructor(rules = {}) {
		if (Object.prototype.toString.call(rules) !== '[object Object]')
			throw new TypeError('Expected rules to be an Object');

		Object.entries(rules).forEach(([name, variant]) => {
			if (!Array.isArray(variant))
				throw new TypeError(`Expected rules.${name} to be an Array`);

			variant.forEach((rule, index) => {
				if (!(rule instanceof Rule))
					throw new TypeError(`Expected rules.${name}[${index}] to be an instance of Rule`);
			});
		});

		this.#rules = rules;
	}

	/**
	 * Get the rules of this Grammar
	 */
	get rules() {
		return this.#rules;
	}

	/**
	 * Set the rules of this Grammar
	 * @param {{[key: string]: Rule[]}} value
	 */
	set rules(value) {
		if (Object.prototype.toString.call(value) !== '[object Object]')
			throw new TypeError('Expected value to be an Object');

		Object.entries(value).forEach(([name, ruleSet]) => {
			if (!Array.isArray(ruleSet))
				throw new TypeError(`Expected value.${name} to be an Array`);

			ruleSet.forEach((rule, index) => {
				if (!(rule instanceof Rule))
					throw new TypeError(`Expected value.${name}[${index}] to be an instance of Rule`);
			});
		});

		this.#rules = value;
	}
}

module.exports = { Grammar };