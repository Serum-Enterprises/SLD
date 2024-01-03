const { BaseSymbol } = require('../../lib/dataClass/BaseSymbol');
const { SymbolSet } = require('../../lib/dataClass/SymbolSet');
const { Rule } = require('../../lib/dataClass/Rule');

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
		recoverComponent: {
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
		expect(() => Rule.fromJSON({ symbolSets: [], throwMessage: null })).toThrow(new TypeError('Expected data.recoverComponent to be a BaseComponent or null'));

		expect(Rule.fromJSON(jsonData)).toBeInstanceOf(Rule);
		expect(Rule.fromJSON({...jsonData, recoverComponent: null})).toBeInstanceOf(Rule);
	});

	test('Testing constructor', () => {
		expect(() => new Rule(null, 123, 123)).toThrow(new TypeError('Expected symbolSets to be an Array'));
		expect(() => new Rule([123], 123, 123)).toThrow(new TypeError('Expected symbolSets to be an Array of SymbolSets'));
		expect(() => new Rule([], 123, 123)).toThrow(new TypeError('Expected throwMessage to be a String or null'));
		expect(() => new Rule([], null, 123)).toThrow(new TypeError('Expected recoverComponent to be an instance of BaseSymbol or null'));

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

	test('Testing get throwMessage', () => {
		expect((new Rule([])).throwMessage).toBe(null);
		expect((new Rule([], 'This Rule failed')).throwMessage).toBe('This Rule failed');
	});

	test('Testing get recoverComponent', () => {
		const baseSymbol = new BaseSymbol('STRING', ';', null);

		expect((new Rule([])).recoverComponent).toBe(null);
		expect((new Rule([], null, baseSymbol)).recoverComponent).toEqual(baseSymbol);
	});

	test('Testing toJSON', () => {
		const rule1 = Rule.fromJSON(jsonData);
		const rule2 = Rule.fromJSON({...jsonData, recoverComponent: null});

		expect(rule1.toJSON()).toEqual(jsonData);
		expect(rule2.toJSON()).toEqual({...jsonData, recoverComponent: null});
	});
});