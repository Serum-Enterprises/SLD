const { Rule } = require('./Rule.js');

class Grammar {
	#rules;

	static fromJSON(data, name = 'data') {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		const rules = Object.entries(data).reduce((result, [key, variant]) => {
			if (!Array.isArray(variant))
				throw new TypeError(`Expected ${name}.${key} to be an Array`);

			return {
				...result,
				[key]: variant.map((rule, index) => {
					return Rule.fromJSON(rule, `${name}.${key}[${index}]`);
				})
			};
		}, {});

		return new Grammar(rules);
	}

	constructor(rules) {
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

	get rules() {
		return this.#rules;
	}

	toJSON() {
		return Object.entries(this.#rules).reduce((rules, [name, variant]) => {
			return { ...rules, [name]: variant.map(rule => rule.toJSON()) };
		}, {});
	}
}

module.exports = { Grammar };