const { BaseSymbol } = require('./BaseSymbol');
const { SymbolSet } = require('./SymbolSet');

class Rule {
	#symbolSets;
	#throwMessage;
	#recoverSymbol;

	/**
	 * Create a new Rule Instance from JSON Data
	 * @param {unknown} data 
	 * @param {string | null} [name = "data"] 
	 * @returns {Rule}
	 */
	static fromJSON(data, name = 'data') {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		if (!Array.isArray(data.symbolSets))
			throw new TypeError(`Expected ${name}.symbolSets to be an Array`);

		const symbolSets = data.symbolSets.map((symbolSet, index) => {
			return SymbolSet.fromJSON(symbolSet, `${name}.symbolSets[${index}]`);
		});

		if (typeof data.throwMessage !== 'string' && data.throwMessage !== null)
			throw new TypeError(`Expected ${name}.throwMessage to be a String or null`);

		let recoverSymbol;

		if (data.recoverSymbol === null)
			recoverSymbol = null;
		else if (Object.prototype.toString.call(data.recoverSymbol) === '[object Object]')
			recoverSymbol = BaseSymbol.fromJSON(data.recoverSymbol, `${name}.recoverSymbol`);
		else
			throw new TypeError(`Expected ${name}.recoverSymbol to be a BaseComponent or null`);

		return new Rule(symbolSets, data.throwMessage, recoverSymbol);
	}

	/**
	 * Create a new Rule Instance
	 * @param {SymbolSet[]} [symbolSets = []] 
	 * @param {string | null} [throwMessage = null] 
	 * @param {BaseSymbol | null} [recoverSymbol = null] 
	 */
	constructor(symbolSets = [], throwMessage = null, recoverSymbol = null) {
		if (!Array.isArray(symbolSets))
			throw new TypeError('Expected symbolSets to be an Array');

		symbolSets.forEach((symbolSet, index) => {
			if (!(symbolSet instanceof SymbolSet))
				throw new TypeError(`Expected symbolSets[${index}] to be an instance of SymbolSet`);
		});

		if (typeof throwMessage !== 'string' && throwMessage !== null)
			throw new TypeError('Expected throwMessage to be a String or null');

		if (recoverSymbol !== null && !(recoverSymbol instanceof BaseSymbol))
			throw new TypeError('Expected recoverSymbol to be an instance of BaseSymbol or null');

		this.#symbolSets = symbolSets;
		this.#throwMessage = throwMessage;
		this.#recoverSymbol = recoverSymbol;
	}

	/**
	 * Get the symbolSets of this Rule
	 * @returns {SymbolSet[]}
	 */
	get symbolSets() {
		return this.#symbolSets;
	}

	/**
	 * Set the symbolSets of this Rule
	 * @param {SymbolSet[]} value
	 */
	set symbolSets(value) {
		if (!Array.isArray(value))
			throw new TypeError('Expected symbolSets to be an Array');

		value.forEach((symbolSet, index) => {
			if (!(symbolSet instanceof SymbolSet))
				throw new TypeError(`Expected symbolSets[${index}] to be an instance of SymbolSet`);
		});

		this.#symbolSets = value;
	}

	/**
	 * Get the throwMessage of this Rule
	 * @returns {string | null}
	 */
	get throwMessage() {
		return this.#throwMessage;
	}

	/**
	 * Set the throwMessage of this Rule
	 * @param {string | null} value
	 */
	set throwMessage(value) {
		if (typeof value !== 'string' && value !== null)
			throw new TypeError('Expected throwMessage to be a String or null');

		this.#throwMessage = value;
	}

	/**
	 * Get the recoverSymbol of this Rule
	 * @returns {BaseSymbol | null}
	 */
	get recoverSymbol() {
		return this.#recoverSymbol;
	}

	/**
	 * Set the recoverSymbol of this Rule
	 * @param {BaseSymbol | null} value
	 */
	set recoverSymbol(value) {
		if (value !== null && !(value instanceof BaseSymbol))
			throw new TypeError('Expected recoverSymbol to be an instance of BaseSymbol or null');

		this.#recoverSymbol = value;
	}

	/**
	 * Convert this Rule Instance to JSON Data
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			symbolSets: this.#symbolSets.map(symbolSet => symbolSet.toJSON()),
			throwMessage: this.#throwMessage,
			recoverSymbol: this.#recoverSymbol === null ? null : this.#recoverSymbol.toJSON()
		};
	}
}

module.exports = { Rule };