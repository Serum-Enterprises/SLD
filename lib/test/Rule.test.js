const { BaseSymbol } = require('../BaseSymbol');
const { SymbolSet } = require('../SymbolSet');
const { Rule } = require('../Rule');

describe('Testing Rule', () => {
	const jsonData = {
		symbolSets: [
			{
				symbols: [
					{
						type: 'STRING',
						value: 'Hello World',
						name: null
					}
				],
				optional: false,
				greedy: false
			},
			{
				symbols: [
					{
						type: 'STRING',
						value: ';',
						name: null
					}
				],
				optional: true,
				greedy: true
			}
		],
		throwMessage: 'Hello World',
		recoverSymbol: {
			type: 'STRING',
			value: ';',
			name: null
		}
	};

	test('Testing static fromJSON', () => {
		expect(() => Rule.fromJSON(null, null)).toThrow(new TypeError('Expected name to be a String'));
		expect(() => Rule.fromJSON(null)).toThrow(new TypeError('Expected data to be an Object'));
		expect(() => Rule.fromJSON({})).toThrow(new TypeError('Expected data.symbolSets to be an Array'));
		expect(() => Rule.fromJSON({ symbolSets: [] })).toThrow(new TypeError('Expected data.throwMessage to be a String or null'));
		expect(() => Rule.fromJSON({ symbolSets: [], throwMessage: null })).toThrow(new TypeError('Expected data.recoverSymbol to be a BaseComponent or null'));

		expect(Rule.fromJSON(jsonData)).toBeInstanceOf(Rule);
		expect(Rule.fromJSON({ ...jsonData, recoverSymbol: null })).toBeInstanceOf(Rule);
	});

	test('Testing constructor', () => {
		expect(() => new Rule(null, 123, 123)).toThrow(new TypeError('Expected symbolSets to be an Array'));
		expect(() => new Rule([123], 123, 123)).toThrow(new TypeError('Expected symbolSets[0] to be an instance of SymbolSet'));
		expect(() => new Rule([], 123, 123)).toThrow(new TypeError('Expected throwMessage to be a String or null'));
		expect(() => new Rule([], null, 123)).toThrow(new TypeError('Expected recoverSymbol to be an instance of BaseSymbol or null'));

		expect(new Rule()).toBeInstanceOf(Rule);
		expect(new Rule([])).toBeInstanceOf(Rule);
		expect(new Rule([], null, null)).toBeInstanceOf(Rule);
		expect(new Rule([], 'This Rule failed', null)).toBeInstanceOf(Rule);
		expect(new Rule([], 'This Rule failed', new BaseSymbol('STRING', ';', null))).toBeInstanceOf(Rule);
	});

	test('Testing get symbolSets', () => {
		const symbolSet = new SymbolSet([new BaseSymbol('STRING', 'Hello World', null)], false, false);

		expect((new Rule([])).symbolSets).toEqual([]);
		expect((new Rule([symbolSet])).symbolSets).toEqual([symbolSet]);
	});

	test('Testing set symbolSets', () => {
		const symbolSet = new SymbolSet([new BaseSymbol('STRING', 'Hello World', null)], false, false);
		const rule = new Rule([]);

		expect(() => rule.symbolSets = null).toThrow(new TypeError('Expected symbolSets to be an Array'));
		expect(() => rule.symbolSets = [123]).toThrow(new TypeError('Expected symbolSets[0] to be an instance of SymbolSet'));

		rule.symbolSets = [symbolSet];
		expect(rule.symbolSets).toEqual([symbolSet]);
	});

	test('Testing get throwMessage', () => {
		expect((new Rule([])).throwMessage).toBe(null);
		expect((new Rule([], 'This Rule failed')).throwMessage).toBe('This Rule failed');
	});

	test('Testing set throwMessage', () => {
		const rule = new Rule([]);

		expect(() => rule.throwMessage = 123).toThrow(new TypeError('Expected throwMessage to be a String or null'));

		rule.throwMessage = 'This Rule failed';
		expect(rule.throwMessage).toBe('This Rule failed');
	});

	test('Testing get recoverSymbol', () => {
		const baseSymbol = new BaseSymbol('STRING', ';', null);

		expect((new Rule([])).recoverSymbol).toBe(null);
		expect((new Rule([], null, baseSymbol)).recoverSymbol).toEqual(baseSymbol);
	});

	test('Testing set recoverSymbol', () => {
		const baseSymbol = new BaseSymbol('STRING', ';', null);
		const rule = new Rule([]);

		expect(() => rule.recoverSymbol = 123).toThrow(new TypeError('Expected recoverSymbol to be an instance of BaseSymbol or null'));

		rule.recoverSymbol = baseSymbol;
		expect(rule.recoverSymbol).toEqual(baseSymbol);
	});

	test('Testing toJSON', () => {
		const rule1 = Rule.fromJSON(jsonData);
		const rule2 = Rule.fromJSON({ ...jsonData, recoverSymbol: null });

		expect(rule1.toJSON()).toEqual(jsonData);
		expect(rule2.toJSON()).toEqual({ ...jsonData, recoverSymbol: null });
	});
});