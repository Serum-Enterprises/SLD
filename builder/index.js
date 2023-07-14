/**
 * @typedef {{type: 'STRING' | 'REGEXP' | 'VARIANT', value: string, name: string | null, greedy: boolean, optional: boolean}} ComponentInterface
 * @typedef {{components: ComponentInterface[], throwMessage: string | null, recoverComponent: ComponentInterface | null}} RuleInterface
 * @typedef {RuleInterface[]} VariantInterface
 * @typedef {{[key: string]: VariantInterface}} GrammarInterface
 */

class Grammar extends Map {
	/**
	 * 	Create a new Grammar Instance
	 * @param {{[key: string]: Variant}} [variants = {}] 
	 * @returns {Grammar}
	 */
	static create(variants = {}) {
		return new Grammar(variants);
	}

	/**
	 * Create a new Grammar Instance
	 * @param {{[key: string]: Variant}} [variants = {}] 
	 */
	constructor(variants = {}) {
		if (!Object.prototype.toString.call(variants) === '[object Object]')
			throw new TypeError('Expected variants to be an Object');

		super(Object.entries(variants).map(([key, value]) => {
			if (typeof key !== 'string')
				throw new TypeError('Expected key to be a String');

			if (!(value instanceof Variant))
				throw new TypeError('Expected value to be an instance of Variant');

			return [key, value];
		}));
	}

	/**
	 * Convert this Instance to a GrammarInterface
	 * @returns {GrammarInterface}
	 */
	toJSON() {
		return Array.from(this.entries()).reduce((acc, [key, value]) => {
			return { ...acc, [key]: value.toJSON() };
		}, {});
	}

	/**
	 * Add a new Variant to this Grammar
	 * @param {string} key 
	 * @param {Variant} value 
	 * @returns {Grammar}
	 */
	set(key, value) {
		if (typeof key !== 'string')
			throw new TypeError('Expected key to be a String');

		if (!(value instanceof Variant))
			throw new TypeError('Expected value to be an instance of Variant');

		return super.set(key, value);
	}
}

class Variant extends Set {
	/**
	 * Create a new Variant Instance
	 * @param {Rule[]} [rules = []] 
	 * @returns {Variant}
	 */
	static create(rules = []) {
		return new Variant(rules);
	}

	/**
	 * Create a new Variant Instance
	 * @param {Rule[]} [rules = []]
	 */
	constructor(rules = []) {
		if (!Array.isArray(rules))
			throw new TypeError('Expected rules to be an Array');

		super(rules.map(rule => {
			if (!(rule instanceof Rule))
				throw new TypeError('Expected rule to be an instance of Rule');

			return rule;
		}));
	}

	/**
	 * Convert this Instance to a VariantInterface
	 * @returns {VariantInterface}
	 */
	toJSON() {
		return Array.from(this.values()).map(rule => rule.toJSON());
	}

	/**
	 * Add a new Rule to this Variant
	 * @param {Rule} value 
	 * @returns {Variant}
	 */
	add(value) {
		if (!(value instanceof Rule))
			throw new TypeError('Expected value to be an instance of Rule');

		return super.add(value);
	}
}

class Rule {
	/**
	 * @type {ComponentInterface[]}
	 */
	#components;
	/**
	 * @type {string | null}
	 */
	#throwMessage;
	/**
	 * @type {ComponentInterface}
	 */
	#recoverComponent;

	/**
	 * Begin a new Rule
	 * @returns {QuantitySelector}
	 */
	static begin() {
		return new Rule().begin();
	}

	/**
	 * Create a Throwing Rule
	 * @param {string} message 
	 * @returns {Rule}
	 */
	static throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		return new Rule().throw(message);
	}

	/**
	 * Create a new Rule Instance
	 */
	constructor() {
		this.#components = [];
		this.#throwMessage = null;
		this.#recoverComponent = null;
	}

	/**
	 * Add a Component to this Rule Instance
	 * @param {'STRING' | 'REGEXP' | 'VARIANT'} type 
	 * @param {string} value 
	 * @param {string | null} [name = null] 
	 * @param {boolean} [greedy = false] 
	 * @param {boolean} [optional = false] 
	 * @returns {Rule}
	 */
	addComponent(type, value, name = null, greedy = false, optional = false) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['STRING', 'REGEXP', 'VARIANT'].includes(type))
			throw new TypeError('Expected type to be "STRING", "REGEXP" or "VARIANT"');

		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		this.#components.push({ type, value, name, greedy, optional });

		return this;
	}

	/**
	 * Begin adding Components to this Rule Instance
	 * @returns {QuantitySelector}
	 */
	begin() {
		return new QuantitySelector(this);
	}

	/**
	 * Add a recovery Component to this Rule Instance
	 * @param {'STRING' | 'REGEXP' | 'VARIANT'} type 
	 * @param {'string'} value 
	 * @returns {Rule}
	 */
	recover(type, value) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		this.#recoverComponent = { type, value, name: null, greedy: null, optional: null };
		return this;
	}

	/**
	 * Set the Throw Message for this Rule Instance
	 * @param {string} message 
	 * @returns {Rule}
	 */
	throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.#throwMessage = message;
		return this;
	}

	/**
	 * Start adding a new Component to this Rule Instance
	 * @returns {QuantitySelector}
	 */
	followedBy() {
		this.#components.push({ type: 'REGEXP', value: /\s+/.source, name: null, greedy: false, optional: false });

		return new QuantitySelector(this);
	}

	/**
	 * Start adding a new Component to this Rule Instance
	 * @returns {QuantitySelector}
	 */
	directlyFollowedBy() {
		return new QuantitySelector(this);
	}

	/**
	 * Convert this Instance to a RuleInterface
	 * @returns {RuleInterface}
	 */
	toJSON() {
		return {
			components: this.#components,
			throwMessage: this.#throwMessage,
			recoverComponent: this.#recoverComponent
		};
	}
}

class ComponentSelector {
	/**
	 * @type {Rule}
	 */
	#ruleInstance;
	/**
	 * @type {boolean}
	 */
	#greedy;
	/**
	 * @type {boolean}
	 */
	#optional;

	/**
	 * Create a new ComponentSelector Instance
	 * @param {Rule} ruleInstance 
	 * @param {boolean} [greedy = false]
	 * @param {boolean} [optional = false] 
	 */
	constructor(ruleInstance, greedy = false, optional = false) {
		if (!(ruleInstance instanceof Rule))
			throw new TypeError('Expected ruleInstance to be a Rule');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		this.#ruleInstance = ruleInstance;
		this.#greedy = greedy;
		this.#optional = optional;
	}

	/**
	 * Add a String Component to the Rule Instance
	 * @param {string} string 
	 * @param {string | null} [name = null] 
	 * @returns {Rule}
	 */
	string(string, name = null) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent('STRING', string, name, this.#greedy, this.#optional);
	}

	/**
	 * Add a RegExp Component to the Rule Instance
	 * @param {RegExp} regexp 
	 * @param {string | null} [name = null] 
	 * @returns {Rule}
	 */
	regexp(regexp, name = null) {
		if (!(regexp instanceof RegExp))
			throw new TypeError('Expected regexp to be a RegExp');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent('REGEXP', regexp.source, name, this.#greedy, this.#optional);
	}

	/**
	 * Add a Variant Component to the Rule Instance
	 * @param {string} variant 
	 * @param {string | null} [name = null] 
	 * @returns {Rule}
	 */
	variant(variant, name = null) {
		if (typeof variant !== 'string')
			throw new TypeError('Expected variant to be a String');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent('VARIANT', variant, name, this.#greedy, this.#optional);
	}
}

class QuantitySelector {
	/**
	 * @type {Rule}
	 */
	#ruleInstance;

	/**
	 * Create a new QuantitySelector Instance
	 * @param {Rule} ruleInstance 
	 */
	constructor(ruleInstance) {
		if (!(ruleInstance instanceof Rule))
			throw new TypeError('Expected ruleInstance to be a Rule');

		this.#ruleInstance = ruleInstance;
	}

	/**
	 * Select one for the ComponentSelector
	 * @returns {ComponentSelector}
	 */
	one() {
		return new ComponentSelector(this.#ruleInstance, false, false);
	}

	/**
	 * Select zero or one for the ComponentSelector
	 * @returns {ComponentSelector}
	 */
	zeroOrOne() {
		return new ComponentSelector(this.#ruleInstance, false, true);
	}

	/**
	 * Select zero or more for the ComponentSelector
	 * @returns {ComponentSelector}
	 */
	zeroOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, true);
	}

	/**
	 * Select one or more for the ComponentSelector
	 * @returns {ComponentSelector}
	 */
	oneOrMore() {
		return new ComponentSelector(this.#ruleInstance, true, false);
	}
}

module.exports = { Grammar, Variant, Rule };