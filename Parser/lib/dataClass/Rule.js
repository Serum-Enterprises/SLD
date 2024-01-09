const { BaseSymbol } = require('./BaseSymbol');
const { SymbolSet } = require('./SymbolSet');

class Rule {
	#symbolSets;
	#throwMessage;
	#recoverComponent;

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

		let recoverComponent;

		if (data.recoverComponent === null)
			recoverComponent = null;
		else if (Object.prototype.toString.call(data.recoverComponent) === '[object Object]')
			recoverComponent = BaseSymbol.fromJSON(data.recoverComponent, `${name}.recoverComponent`);
		else
			throw new TypeError(`Expected ${name}.recoverComponent to be a BaseComponent or null`);

		return new Rule(symbolSets, data.throwMessage, recoverComponent);
	}

	/**
	 * Create a new Rule Instance
	 * @param {SymbolSet[]} symbolSets 
	 * @param {string | null} [throwMessage = null] 
	 * @param {BaseSymbol | null} [recoverComponent = null] 
	 */
	constructor(symbolSets, throwMessage = null, recoverComponent = null) {
		if (!Array.isArray(symbolSets))
			throw new TypeError('Expected symbolSets to be an Array');

		if (!symbolSets.every(symbolSet => symbolSet instanceof SymbolSet))
			throw new TypeError('Expected symbolSets to be an Array of SymbolSets');

		if (typeof throwMessage !== 'string' && throwMessage !== null)
			throw new TypeError('Expected throwMessage to be a String or null');

		if (recoverComponent !== null && !(recoverComponent instanceof BaseSymbol))
			throw new TypeError('Expected recoverComponent to be an instance of BaseSymbol or null');

		this.#symbolSets = symbolSets;
		this.#throwMessage = throwMessage;
		this.#recoverComponent = recoverComponent;
	}

	/**
	 * Get the symbolSets of this Rule
	 * @returns {SymbolSet[]}
	 */
	get symbolSets() {
		return this.#symbolSets;
	}

	/**
	 * Get the throwMessage of this Rule
	 * @returns {string | null}
	 */
	get throwMessage() {
		return this.#throwMessage;
	}

	/**
	 * Get the recoverComponent of this Rule
	 * @returns {BaseSymbol | null}
	 */
	get recoverComponent() {
		return this.#recoverComponent;
	}

	/**
	 * Convert this Rule Instance to JSON Data
	 * @returns {unknown}
	 */
	toJSON() {
		return {
			symbolSets: this.#symbolSets.map(symbolSet => symbolSet.toJSON()),
			throwMessage: this.#throwMessage,
			recoverComponent: this.#recoverComponent === null ? null : this.#recoverComponent.toJSON()
		};
	}
}

module.exports = { Rule };