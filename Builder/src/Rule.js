// Import Rule DataClass
const RuleDC = require('../../lib/Rule');

class Rule extends RuleDC {
	/**
	 * Create a new Rule Instance and start matching
	 * @returns {QuantitySelector}
	 */
	static match() {
		const rule = new Rule();

		return new QuantitySelector(rule);
	}

	/**
	 * Create a new Rule Instance that automatically throws an Error
	 * @param {string} message 
	 * @returns {Rule}
	 */
	static throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		const rule = new Rule();

		rule.throwMessage = message;

		return rule;
	}

	/**
	 * Set a Recovery Symbol for this Rule
	 * @returns {SymbolSelector}
	 */
	recover() {
		return new SymbolSelector(this, false, false, false, true);
	}

	/**
	 * Set a Throw Message for this Rule
	 * @param {string} message 
	 * @returns {Rule}
	 */
	throw(message) {
		if (typeof message !== 'string')
			throw new TypeError('Expected message to be a String');

		this.throwMessage = message;

		return this;
	}

	/**
	 * Set a following Symbol but insert a Whitespace before it
	 * @returns {QuantitySelector}
	 */
	followedBy() {
		return new QuantitySelector(this, true);
	}
	/**
	 * Set a following Symbol
	 * @returns {QuantitySelector}
	 */
	directlyFollowedBy() {
		return new QuantitySelector(this);
	}
}

class QuantitySelector {
	/**
	 * @type {Rule}
	 */
	#rule;
	/**
	 * @type {boolean}
	 */
	#whiteSpacePrefix;
	/**
	 * @type {boolean}
	 */
	#recoverSymbol;

	/**
	 * Create a new QuantitySelector Instance
	 * @param {Rule} rule 
	 * @param {boolean} whitespacePrefix 
	 * @param {boolean} recoverSymbol 
	 */
	constructor(rule, whitespacePrefix = false, recoverSymbol = false) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be an instance of Rule');

		if (typeof whitespacePrefix !== 'boolean')
			throw new TypeError('Expected whitespacePrefix to be a Boolean');

		if (typeof recoverSymbol !== 'boolean')
			throw new TypeError('Expected recoverSymbol to be a Boolean');

		this.#rule = rule;
		this.#whiteSpacePrefix = whitespacePrefix;
		this.#recoverSymbol = recoverSymbol;
	}

	/**
	 * Set the quantity of this Rule to exactly one
	 * @returns {SymbolSelector}
	 */
	one() {
		return new SymbolSelector(this.#rule, this.#whiteSpacePrefix, false, false, this.#recoverSymbol);
	}
	/**
	 * Set the quantity of this Rule to zero or one
	 * @returns {SymbolSelector}
	 */
	zeroOrOne() {
		return new SymbolSelector(this.#rule, this.#whiteSpacePrefix, true, false, this.#recoverSymbol);
	}
	/**
	 * Set the quantity of this Rule to zero or more
	 * @returns {SymbolSelector}
	 */
	zeroOrMore() {
		return new SymbolSelector(this.#rule, this.#whiteSpacePrefix, true, true, this.#recoverSymbol);
	}
	/**
	 * Set the quantity of this Rule to one or more
	 * @returns {SymbolSelector}
	 */
	oneOrMore() {
		return new SymbolSelector(this.#rule, this.#whiteSpacePrefix, false, true, this.#recoverSymbol);
	}
}

class SymbolSelector {
	/**
	 * @type {Rule}
	 */
	#rule;
	/**
	 * @type {boolean}
	 */
	#whiteSpacePrefix;
	/**
	 * @type {boolean}
	 */
	#optional;
	/**
	 * @type {boolean}
	 */
	#greedy;
	/**
	 * @type {boolean}
	 */
	#recoverSymbol;

	/**
	 * Create a new SymbolSelector Instance
	 * @param {Rule} rule 
	 * @param {boolean} whitespacePrefix 
	 * @param {boolean} optional 
	 * @param {boolean} greedy 
	 * @param {boolean} recoverSymbol 
	 */
	constructor(rule, whitespacePrefix = false, optional = false, greedy = false, recoverSymbol = false) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be an instance of Rule');

		if (typeof whitespacePrefix !== 'boolean')
			throw new TypeError('Expected whitespacePrefix to be a Boolean');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		if (typeof recoverSymbol !== 'boolean')
			throw new TypeError('Expected recoverSymbol to be a Boolean');

		this.#rule = rule;
		this.#whiteSpacePrefix = whitespacePrefix;
		this.#optional = optional;
		this.#greedy = greedy;
		this.#recoverSymbol = recoverSymbol;
	}
	/**
	 * Select a String Symbol
	 * @param {string} value 
	 * @param {string | null} name 
	 * @returns {Rule}
	 */
	string(value, name = null) {
		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (typeof name !== 'string' && name !== null)
			throw new TypeError('Expected name to be a String or null');

		if (this.#recoverSymbol)
			this.#rule.recoverSymbol = new DC.BaseSymbol('STRING', value, name);
		else {
			if (this.#whiteSpacePrefix) {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('REGEXP', '\s*'),
						new DC.BaseSymbol('STRING', value, name)
					], this.#optional, this.#greedy)
				];
			}
			else {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('STRING', value, name)
					], this.#optional, this.#greedy)
				];
			}
		}

		return this.#rule;
	}

	/**
	 * Select a RegExp Symbol
	 * @param {string} value 
	 * @param {string | null} name 
	 * @returns {Rule}
	 */
	regexp(value, name = null) {
		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (typeof name !== 'string' && name !== null)
			throw new TypeError('Expected name to be a String or null');

		if (this.#recoverSymbol)
			this.#rule.recoverSymbol = new DC.BaseSymbol('REGEXP', value, name);
		else {
			if (this.#whiteSpacePrefix) {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('REGEXP', '\s*'),
						new DC.BaseSymbol('REGEXP', value, name)
					], this.#optional, this.#greedy)
				];
			}
			else {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('REGEXP', value, name)
					], this.#optional, this.#greedy)
				];
			}
		}

		return this.#rule;
	}
	/**
	 * Select a Variant Symbol
	 * @param {string} value 
	 * @param {string | null} name 
	 * @returns {Rule}
	 */
	variant(value, name = null) {
		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (typeof name !== 'string' && name !== null)
			throw new TypeError('Expected name to be a String or null');

		if (this.#recoverSymbol)
			this.#rule.recoverSymbol = new DC.BaseSymbol('VARIANT', value, name);
		else {
			if (this.#whiteSpacePrefix) {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('REGEXP', '\s*'),
						new DC.BaseSymbol('VARIANT', value, name)
					], this.#optional, this.#greedy)
				];
			}
			else {
				this.#rule.symbolSets = [
					...this.#rule.symbolSets,
					new DC.SymbolSet([
						new DC.BaseSymbol('VARIANT', value, name)
					], this.#optional, this.#greedy)
				];
			}
		}

		return this.#rule;
	}
}

module.exports = { Rule, QuantitySelector, SymbolSelector };