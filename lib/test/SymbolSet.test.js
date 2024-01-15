const { BaseSymbol } = require('../src/BaseSymbol');
const { SymbolSet } = require('../src/SymbolSet');

describe('Testing SymbolSet', () => {
	const jsonData = {
		symbols: [
			{
				type: 'STRING',
				value: 'Hello World',
				name: 'test'
			}
		],
		optional: true,
		greedy: true
	};

	test('Testing static fromJSON', () => {
		expect(() => SymbolSet.fromJSON(null, null)).toThrow(new TypeError('Expected name to be a String'));
		expect(() => SymbolSet.fromJSON(null)).toThrow(new TypeError('Expected data to be an Object'));
		expect(() => SymbolSet.fromJSON({})).toThrow(new TypeError('Expected data.symbols to be an Array'));
		expect(() => SymbolSet.fromJSON({ symbols: [] })).toThrow(new TypeError('Expected data.optional to be a Boolean'));
		expect(() => SymbolSet.fromJSON({ symbols: [], optional: true })).toThrow(new TypeError('Expected data.greedy to be a Boolean'));

		expect(SymbolSet.fromJSON(jsonData)).toBeInstanceOf(SymbolSet);
	});

	test('Testing constructor', () => {
		expect(() => new SymbolSet(null, null, null)).toThrow(new TypeError('Expected symbols to be an Array'));
		expect(() => new SymbolSet([], null, null)).toThrow(new TypeError('Expected optional to be a Boolean'));
		expect(() => new SymbolSet([123], true, null)).toThrow(new TypeError('Expected symbols[0] to be an instance of BaseSymbol'));
		expect(() => new SymbolSet([], true, null)).toThrow(new TypeError('Expected greedy to be a Boolean'));

		expect(new SymbolSet()).toBeInstanceOf(SymbolSet);
		expect(new SymbolSet([])).toBeInstanceOf(SymbolSet);
		expect(new SymbolSet([], true)).toBeInstanceOf(SymbolSet);
		expect(new SymbolSet([], true, true)).toBeInstanceOf(SymbolSet);
	});

	test('Testing get symbols', () => {
		const baseSymbol = new BaseSymbol('STRING', 'Hello World', 'test');

		expect((new SymbolSet([], true, true)).symbols).toEqual([]);
		expect((new SymbolSet([baseSymbol], true, true)).symbols).toEqual([baseSymbol]);
	});

	test('Testing set symbols', () => {
		const baseSymbol = new BaseSymbol('STRING', 'Hello World', 'test');

		expect(() => (new SymbolSet([], true, true)).symbols = null).toThrow(new TypeError('Expected value to be an Array'));
		expect(() => (new SymbolSet([], true, true)).symbols = [123]).toThrow(new TypeError('Expected value[0] to be an instance of BaseSymbol'));

		const symbolSet = new SymbolSet([], true, true);
		symbolSet.symbols = [baseSymbol];
		expect(symbolSet.symbols).toEqual([baseSymbol]);
	});

	test('Testing get optional', () => {
		expect((new SymbolSet([], true, true)).optional).toBe(true);
	});

	test('Testing set optional', () => {
		const symbolSet = new SymbolSet([], true, true);

		expect(() => symbolSet.optional = null).toThrow(new TypeError('Expected value to be a Boolean'));

		symbolSet.optional = false;
		expect(symbolSet.optional).toBe(false);
	});

	test('Testing get greedy', () => {
		expect((new SymbolSet([], true, true)).greedy).toBe(true);
	});

	test('Testing set greedy', () => {
		const symbolSet = new SymbolSet([], true, true);

		expect(() => symbolSet.greedy = null).toThrow(new TypeError('Expected value to be a Boolean'));

		symbolSet.greedy = false;
		expect(symbolSet.greedy).toBe(false);
	});

	test('Testing toJSON', () => {
		const symbolSet = SymbolSet.fromJSON(jsonData);

		expect(symbolSet.toJSON()).toEqual(jsonData);
	});
});