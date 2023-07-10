const Rule = require('../Rule');
const Variant = require('../Variant');
const Component = require('../Component');

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
	 * Create a new Component Selector
	 * @param {Rule} ruleInstance 
	 * @param {boolean} [greedy=false] 
	 * @param {boolean} [optional=false] 
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
	 * Select a String Component
	 * @param {string} string 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	string(string, name = null) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent(new Component('STRING', string, name, this.#greedy, this.#optional));
	}

	/**
	 * Select a RegExp Component
	 * @param {RegExp} regexp 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	regexp(regexp, name = null) {
		if (!(regexp instanceof RegExp))
			throw new TypeError('Expected regexp to be a RegExp');

		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		return this.#ruleInstance.addComponent(new Component('REGEXP', regexp.source, name, this.#greedy, this.#optional));
	}

	/**
	 * Select a Variant Component
	 * @param {string} variant 
	 * @param {string | null} [name=null] 
	 * @returns {Rule}
	 */
	variant(variant, name = null) {
		if (name !== null && typeof name !== 'string')
			throw new TypeError('Expected name to be a String or null');

		if (variant instanceof Variant)
			return this.#ruleInstance.addComponent(new Component('VARIANT', variant.toJSON(), name, this.#greedy, this.#optional));
		else {
			Verify.variant(variant, 'variant');

			return this.#ruleInstance.addComponent(new Component('VARIANT', variant, name, this.#greedy, this.#optional));
		}
	}
}

module.exports = ComponentSelector;