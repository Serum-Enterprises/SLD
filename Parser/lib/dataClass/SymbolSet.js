const { BaseSymbol } = require('./BaseSymbol.js');

class SymbolSet {
	#symbols;
	#optional;
	#greedy;

	static fromJSON(data, name = 'data') {
		if (typeof name !== 'string')
			throw new TypeError('Expected name to be a String');

		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${name} to be an Object`);

		if (!Array.isArray(data.symbols))
			throw new TypeError(`Expected ${name}.symbols to be an Array`);

		const symbols = data.symbols.map((symbol, index) => {
			return BaseSymbol.fromJSON(symbol, `${name}.symbols[${index}]`);
		});

		if (typeof data.optional !== 'boolean')
			throw new TypeError(`Expected ${name}.optional to be a Boolean`);

		if (typeof data.greedy !== 'boolean')
			throw new TypeError(`Expected ${name}.greedy to be a Boolean`);

		return new SymbolSet(symbols, data.optional, data.greedy);
	}

	constructor(symbols, optional = false, greedy = false) {
		if (!Array.isArray(symbols))
			throw new TypeError('Expected symbols to be an Array');

		if (!symbols.every(symbol => symbol instanceof BaseSymbol))
			throw new TypeError('Expected symbols to be an Array of BaseSymbols');

		if (typeof optional !== 'boolean')
			throw new TypeError('Expected optional to be a Boolean');

		if (typeof greedy !== 'boolean')
			throw new TypeError('Expected greedy to be a Boolean');

		this.#symbols = symbols;
		this.#optional = optional;
		this.#greedy = greedy;
	}
	
	get symbols() {
		return this.#symbols;
	}

	get optional() {
		return this.#optional;
	}

	get greedy() {
		return this.#greedy;
	}

	toJSON() {
		return {
			symbols: this.#symbols.map(symbol => symbol.toJSON()),
			optional: this.#optional,
			greedy: this.#greedy
		};
	}
}

module.exports = { SymbolSet };