const { BaseSymbol } = require('./BaseSymbol.js');

class SymbolSet {
	#symbols;
	#optional;
	#greedy;

	/**
	 * Create a new SymbolSet Instance
	 * @param {BaseSymbol[]} [symbols = []] 
	 * @param {boolean} [optional = false] 
	 * @param {boolean} [greedy = false] 
	 */
	constructor(symbols = [], optional = false, greedy = false) {
		if (!Array.isArray(symbols))
			throw new TypeError('Expected symbols to be an Array');

		symbols.forEach((symbol, index) => {
			if (!(symbol instanceof BaseSymbol))
				throw new TypeError(`Expected symbols[${index}] to be an instance of BaseSymbol`);
		});

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		this.#symbols = symbols;
		this.#optional = optional;
		this.#greedy = greedy;
	}

	/**
	 * Get the symbols of this SymbolSet
	 * @returns {BaseSymbol[]}
	 */
	get symbols() {
		return this.#symbols;
	}

	/**
	 * Set the symbols of this SymbolSet
	 * @param {BaseSymbol[]} value 
	 */
	set symbols(value) {
		if (!Array.isArray(value))
			throw new TypeError('Expected value to be an Array');

		value.forEach((symbol, index) => {
			if (!(symbol instanceof BaseSymbol))
				throw new TypeError(`Expected value[${index}] to be an instance of BaseSymbol`);
		});

		this.#symbols = value;
	}

	/**
	 * Get the optional flag of this SymbolSet
	 * @returns {boolean}
	 */
	get optional() {
		return this.#optional;
	}

	/**
	 * Set the optional flag of this SymbolSet
	 * @param {boolean} value
	 */
	set optional(value) {
		if (typeof value !== 'boolean')
			throw new TypeError('Expected value to be a Boolean');

		this.#optional = value;
	}

	/**
	 * Get the greedy flag of this SymbolSet
	 * @returns {boolean}
	 */
	get greedy() {
		return this.#greedy;
	}

	/**
	 * Set the greedy flag of this SymbolSet
	 * @param {boolean} value
	 */
	set greedy(value) {
		if (typeof value !== 'boolean')
			throw new TypeError('Expected value to be a Boolean');

		this.#greedy = value;
	}

	/**
	 * Return Debug Information about this SymbolSet
	 * @returns {unknown}
	 */
	debug() {
		return {
			symbols: this.#symbols.map(symbol => symbol.debug()),
			optional: this.#optional,
			greedy: this.#greedy
		};
	}
}

module.exports = { SymbolSet };