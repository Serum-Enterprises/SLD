const { Rule } = require('./Rule.js');

class Grammar {
	#rules;

	static fromJSON(data, name = 'data') {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		const rules = Object.entries(data).map(([key, rules]) => {
			if (!Array.isArray(rules))
				throw new TypeError(`Expected ${name}.${key} to be an Array`);

			return rules.map((rule, index) => {
				return Rule.fromJSON(rule, `${name}.${key}[${index}]`);
			});
		});

		return new Grammar(rules);
	}

	constructor(rules) {
		if (Object.prototype.toString.call(rules) !== '[object Object]')
			throw new TypeError('Expected rules to be an Object');

		Object.entries(rules).forEach(([name, rules]) => {
			if (typeof name !== 'string')
				throw new TypeError('Expected name to be a String');

			if (!Array.isArray(rules))
				throw new TypeError('Expected rules to be an Array');

			if (!rules.every(rule => rule instanceof Rule))
				throw new TypeError('Expected rules to be an Array of Rules');
		});

		this.#rules = rules;
	}

	get rules() {
		return this.#rules;
	}

	toJSON() {
		return Object.entries(this.#rules).reduce((rules, [name, rules]) => {
			return { ...rules, [name]: rules.map(rule => rule.toJSON()) };
		}, {});
	}
}

module.exports = { Grammar };