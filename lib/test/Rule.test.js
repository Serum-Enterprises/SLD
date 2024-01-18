const { BaseSymbol } = require('../src/BaseSymbol');
const { SymbolSet } = require('../src/SymbolSet');
const { Rule } = require('../src/Rule');

describe('Testing Rule', () => {
	test('Testing constructor', () => {
		expect(() => new Rule(null, 123, 123)).toThrow(new TypeError('Expected symbolSets to be an Array'));
		expect(() => new Rule([123], 123, 123)).toThrow(new TypeError('Expected symbolSets[0] to be an instance of SymbolSet'));
		expect(() => new Rule([], 123, 123)).toThrow(new TypeError('Expected throwMessage to be a String or null'));
		expect(() => new Rule([], null, 123)).toThrow(new TypeError('Expected recoverSymbol to be an instance of BaseSymbol or null'));
		expect(() => new Rule([], null, null, 123)).toThrow(new TypeError('Expected transformer to be a Function or null'));

		expect(new Rule()).toBeInstanceOf(Rule);
		expect(new Rule([])).toBeInstanceOf(Rule);
		expect(new Rule([], null, null)).toBeInstanceOf(Rule);
		expect(new Rule([], 'This Rule failed', null)).toBeInstanceOf(Rule);
		expect(new Rule([], 'This Rule failed', new BaseSymbol('STRING', ';', null))).toBeInstanceOf(Rule);
		expect(new Rule([], 'This Rule failed', new BaseSymbol('STRING', ';', null), () => { })).toBeInstanceOf(Rule);
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

	test('Testing get transformer', () => {
		const transformer = () => { };

		expect((new Rule([])).transformer).toBe(null);
		expect((new Rule([], null, null, transformer)).transformer).toEqual(transformer);
	});

	test('Testing set transformer', () => {
		const transformer = () => { };
		const rule = new Rule([]);

		expect(() => rule.transformer = 123).toThrow(new TypeError('Expected value to be a Function or null'));

		rule.transformer = transformer;
		expect(rule.transformer).toEqual(transformer);
	});

	test('Testing debug', () => {
		const symbolSet = new SymbolSet([new BaseSymbol('STRING', 'Hello World', null)], false, false);

		expect((new Rule([])).debug()).toEqual({ symbolSets: [], throwMessage: null, recoverSymbol: null, transformer: null });
		expect((new Rule([symbolSet], 'This Rule failed', new BaseSymbol('STRING', ';', null), () => {})).debug()).toEqual({ symbolSets: [symbolSet.debug()], throwMessage: 'This Rule failed', recoverSymbol: new BaseSymbol('STRING', ';', null).debug(), transformer: 'function' });
	})
});