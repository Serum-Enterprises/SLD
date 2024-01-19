const { Rule, SymbolSelector, QuantitySelector } = require('../src/Rule');

describe('Testing Rule', () => {
	test('Testing static match', () => {
		expect(Rule.match()).toBeInstanceOf(QuantitySelector);
	});

	test('Testing static throw', () => {
		expect(() => Rule.throw(123)).toThrow(new TypeError('Expected message to be a String'));

		expect(Rule.throw('Test Message')).toBeInstanceOf(Rule);
		expect(Rule.throw('Test Message').throwMessage).toBe('Test Message');
	});

	test('Testing recover', () => {
		expect(new Rule().recover()).toBeInstanceOf(SymbolSelector);
		expect(new Rule().recover().rule).toBeInstanceOf(Rule);
		expect(new Rule().recover().whitespacePrefix).toBe(false);
		expect(new Rule().recover().optional).toBe(false);
		expect(new Rule().recover().greedy).toBe(false);
		expect(new Rule().recover().recoverSymbol).toBe(true);
	});

	test('Testing throw', () => {
		expect(() => new Rule().throw(123)).toThrow(new TypeError('Expected message to be a String'));

		expect(new Rule().throw('Test Message')).toBeInstanceOf(Rule);
		expect(new Rule().throw('Test Message').throwMessage).toBe('Test Message');
	});

	test('Testing followedBy', () => {
		expect(new Rule().followedBy()).toBeInstanceOf(QuantitySelector);
		expect(new Rule().followedBy().rule).toBeInstanceOf(Rule);
		expect(new Rule().followedBy().whitespacePrefix).toBe(true);
		expect(new Rule().followedBy().recoverSymbol).toBe(false);
	});

	test('Testing directlyFollowedBy', () => {
		expect(new Rule().directlyFollowedBy()).toBeInstanceOf(QuantitySelector);
		expect(new Rule().directlyFollowedBy().rule).toBeInstanceOf(Rule);
		expect(new Rule().directlyFollowedBy().whitespacePrefix).toBe(false);
		expect(new Rule().directlyFollowedBy().recoverSymbol).toBe(false);
	});

	test('Testing transform', () => {
		expect(() => new Rule().transform(123)).toThrow(new TypeError('Expected transformer to be a Function'));

		expect(new Rule().transform(() => { })).toBeInstanceOf(Rule);
		expect(new Rule().transform(() => { }).transformer).toBeInstanceOf(Function);
	})
});

describe('Testing QuantitySelector', () => {
	test('Testing constructor', () => {
		expect(() => new QuantitySelector()).toThrow(new TypeError('Expected rule to be an instance of Rule'));
		expect(() => new QuantitySelector(new Rule(), 123)).toThrow(new TypeError('Expected whitespacePrefix to be a Boolean'));
		expect(() => new QuantitySelector(new Rule(), true, 123)).toThrow(new TypeError('Expected recoverSymbol to be a Boolean'));

		expect(new QuantitySelector(new Rule())).toBeInstanceOf(QuantitySelector);
		expect(new QuantitySelector(new Rule()).rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule()).whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule()).recoverSymbol).toBe(false);

		expect(new QuantitySelector(new Rule(), true)).toBeInstanceOf(QuantitySelector);
		expect(new QuantitySelector(new Rule(), true).rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule(), true).whitespacePrefix).toBe(true);
		expect(new QuantitySelector(new Rule(), true).recoverSymbol).toBe(false);

		expect(new QuantitySelector(new Rule(), true, true)).toBeInstanceOf(QuantitySelector);
		expect(new QuantitySelector(new Rule(), true, true).rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule(), true, true).whitespacePrefix).toBe(true);
		expect(new QuantitySelector(new Rule(), true, true).recoverSymbol).toBe(true);
	});

	test('Testing get rule', () => {
		expect(new QuantitySelector(new Rule()).rule).toBeInstanceOf(Rule);
	});

	test('Testing get whitespacePrefix', () => {
		expect(new QuantitySelector(new Rule()).whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule(), true).whitespacePrefix).toBe(true);
	});

	test('Testing get recoverSymbol', () => {
		expect(new QuantitySelector(new Rule()).recoverSymbol).toBe(false);
		expect(new QuantitySelector(new Rule(), false, true).recoverSymbol).toBe(true);
	});

	test('Testing one', () => {
		expect(new QuantitySelector(new Rule()).one()).toBeInstanceOf(SymbolSelector);
		expect(new QuantitySelector(new Rule()).one().rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule()).one().whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule()).one().recoverSymbol).toBe(false);
		expect(new QuantitySelector(new Rule()).one().optional).toBe(false);
		expect(new QuantitySelector(new Rule()).one().greedy).toBe(false);
	});

	test('Testing zeroOrOne', () => {
		expect(new QuantitySelector(new Rule()).zeroOrOne()).toBeInstanceOf(SymbolSelector);
		expect(new QuantitySelector(new Rule()).zeroOrOne().rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule()).zeroOrOne().whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule()).zeroOrOne().recoverSymbol).toBe(false);
		expect(new QuantitySelector(new Rule()).zeroOrOne().optional).toBe(true);
		expect(new QuantitySelector(new Rule()).zeroOrOne().greedy).toBe(false);
	});

	test('Testing zeroOrMore', () => {
		expect(new QuantitySelector(new Rule()).zeroOrMore()).toBeInstanceOf(SymbolSelector);
		expect(new QuantitySelector(new Rule()).zeroOrMore().rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule()).zeroOrMore().whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule()).zeroOrMore().recoverSymbol).toBe(false);
		expect(new QuantitySelector(new Rule()).zeroOrMore().optional).toBe(true);
		expect(new QuantitySelector(new Rule()).zeroOrMore().greedy).toBe(true);
	});

	test('Testing oneOrMore', () => {
		expect(new QuantitySelector(new Rule()).oneOrMore()).toBeInstanceOf(SymbolSelector);
		expect(new QuantitySelector(new Rule()).oneOrMore().rule).toBeInstanceOf(Rule);
		expect(new QuantitySelector(new Rule()).oneOrMore().whitespacePrefix).toBe(false);
		expect(new QuantitySelector(new Rule()).oneOrMore().recoverSymbol).toBe(false);
		expect(new QuantitySelector(new Rule()).oneOrMore().optional).toBe(false);
		expect(new QuantitySelector(new Rule()).oneOrMore().greedy).toBe(true);
	});
});

describe('Testing SymbolSelector', () => {
	test('Testing constructor', () => {
		expect(() => new SymbolSelector()).toThrow(new TypeError('Expected rule to be an instance of Rule'));
		expect(() => new SymbolSelector(new Rule(), 123)).toThrow(new TypeError('Expected whitespacePrefix to be a Boolean'));
		expect(() => new SymbolSelector(new Rule(), true, 123)).toThrow(new TypeError('Expected optional to be a Boolean'));
		expect(() => new SymbolSelector(new Rule(), true, true, 123)).toThrow(new TypeError('Expected greedy to be a Boolean'));
		expect(() => new SymbolSelector(new Rule(), true, true, true, 123)).toThrow(new TypeError('Expected recoverSymbol to be a Boolean'));

		expect(new SymbolSelector(new Rule())).toBeInstanceOf(SymbolSelector);
		expect(new SymbolSelector(new Rule()).rule).toBeInstanceOf(Rule);
		expect(new SymbolSelector(new Rule()).whitespacePrefix).toBe(false);
		expect(new SymbolSelector(new Rule()).optional).toBe(false);
		expect(new SymbolSelector(new Rule()).greedy).toBe(false);
		expect(new SymbolSelector(new Rule()).recoverSymbol).toBe(false);

		expect(new SymbolSelector(new Rule(), true)).toBeInstanceOf(SymbolSelector);
		expect(new SymbolSelector(new Rule(), true).rule).toBeInstanceOf(Rule);
		expect(new SymbolSelector(new Rule(), true).whitespacePrefix).toBe(true);
		expect(new SymbolSelector(new Rule(), true).optional).toBe(false);
		expect(new SymbolSelector(new Rule(), true).greedy).toBe(false);
		expect(new SymbolSelector(new Rule(), true).recoverSymbol).toBe(false);

		expect(new SymbolSelector(new Rule(), true, true)).toBeInstanceOf(SymbolSelector);
		expect(new SymbolSelector(new Rule(), true, true).rule).toBeInstanceOf(Rule);
		expect(new SymbolSelector(new Rule(), true, true).whitespacePrefix).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true).optional).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true).greedy).toBe(false);
		expect(new SymbolSelector(new Rule(), true, true).recoverSymbol).toBe(false);

		expect(new SymbolSelector(new Rule(), true, true, true)).toBeInstanceOf(SymbolSelector);
		expect(new SymbolSelector(new Rule(), true, true, true).rule).toBeInstanceOf(Rule);
		expect(new SymbolSelector(new Rule(), true, true, true).whitespacePrefix).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true).optional).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true).greedy).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true).recoverSymbol).toBe(false);

		expect(new SymbolSelector(new Rule(), true, true, true, true)).toBeInstanceOf(SymbolSelector);
		expect(new SymbolSelector(new Rule(), true, true, true, true).rule).toBeInstanceOf(Rule);
		expect(new SymbolSelector(new Rule(), true, true, true, true).whitespacePrefix).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true, true).optional).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true, true).greedy).toBe(true);
		expect(new SymbolSelector(new Rule(), true, true, true, true).recoverSymbol).toBe(true);
	});

	test('Testing get rule', () => {
		expect(new SymbolSelector(new Rule()).rule).toBeInstanceOf(Rule);
	});

	test('Testing get whitespacePrefix', () => {
		expect(new SymbolSelector(new Rule()).whitespacePrefix).toBe(false);
		expect(new SymbolSelector(new Rule(), true).whitespacePrefix).toBe(true);
	});

	test('Testing get optional', () => {
		expect(new SymbolSelector(new Rule()).optional).toBe(false);
		expect(new SymbolSelector(new Rule(), false, true).optional).toBe(true);
	});

	test('Testing get greedy', () => {
		expect(new SymbolSelector(new Rule()).greedy).toBe(false);
		expect(new SymbolSelector(new Rule(), false, false, true).greedy).toBe(true);
	});

	test('Testing get recoverSymbol', () => {
		expect(new SymbolSelector(new Rule()).recoverSymbol).toBe(false);
		expect(new SymbolSelector(new Rule(), false, false, false, true).recoverSymbol).toBe(true);
	});

	test('Testing string', () => {
		expect(() => new SymbolSelector(new Rule()).string(123)).toThrow(new TypeError('Expected value to be a String'));
		expect(() => new SymbolSelector(new Rule()).string('Hello', 123)).toThrow(new TypeError('Expected name to be a String or null'));

		const recoverSymbol = new SymbolSelector(new Rule(), false, false, false, true).string('Hello');

		expect(recoverSymbol.recoverSymbol.type).toBe('STRING');
		expect(recoverSymbol.recoverSymbol.value).toBe('Hello');
		expect(recoverSymbol.recoverSymbol.name).toBe(null);

		const symbolSetWithWS = new SymbolSelector(new Rule(), true).string('Hello');

		expect(symbolSetWithWS.symbolSets[0].symbols[0].type).toBe('REGEXP');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].value).toBe('\\s*');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].name).toBe(null);

		expect(symbolSetWithWS.symbolSets[0].symbols[1].type).toBe('STRING');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].value).toBe('Hello');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].name).toBe(null);

		const symbolSet = new SymbolSelector(new Rule(), false).string('Hello');

		expect(symbolSet.symbolSets[0].symbols[0].type).toBe('STRING');
		expect(symbolSet.symbolSets[0].symbols[0].value).toBe('Hello');
		expect(symbolSet.symbolSets[0].symbols[0].name).toBe(null);
	});

	test('Testing regexp', () => {
		expect(() => new SymbolSelector(new Rule()).regexp(123)).toThrow(new TypeError('Expected value to be a String'));
		expect(() => new SymbolSelector(new Rule()).regexp('\\s+', 123)).toThrow(new TypeError('Expected name to be a String or null'));

		const recoverSymbol = new SymbolSelector(new Rule(), false, false, false, true).regexp('[0-9]');

		expect(recoverSymbol.recoverSymbol.type).toBe('REGEXP');
		expect(recoverSymbol.recoverSymbol.value).toBe('[0-9]');
		expect(recoverSymbol.recoverSymbol.name).toBe(null);

		const symbolSetWithWS = new SymbolSelector(new Rule(), true).regexp('[0-9]');

		expect(symbolSetWithWS.symbolSets[0].symbols[0].type).toBe('REGEXP');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].value).toBe('\\s*');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].name).toBe(null);

		expect(symbolSetWithWS.symbolSets[0].symbols[1].type).toBe('REGEXP');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].value).toBe('[0-9]');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].name).toBe(null);

		const symbolSet = new SymbolSelector(new Rule(), false).regexp('[0-9]');

		expect(symbolSet.symbolSets[0].symbols[0].type).toBe('REGEXP');
		expect(symbolSet.symbolSets[0].symbols[0].value).toBe('[0-9]');
		expect(symbolSet.symbolSets[0].symbols[0].name).toBe(null);
	});

	test('Testing variant', () => {
		expect(() => new SymbolSelector(new Rule()).variant(123)).toThrow(new TypeError('Expected value to be a String'));
		expect(() => new SymbolSelector(new Rule()).variant('Hello', 123)).toThrow(new TypeError('Expected name to be a String or null'));

		const recoverSymbol = new SymbolSelector(new Rule(), false, false, false, true).variant('Hello');

		expect(recoverSymbol.recoverSymbol.type).toBe('VARIANT');
		expect(recoverSymbol.recoverSymbol.value).toBe('Hello');
		expect(recoverSymbol.recoverSymbol.name).toBe(null);

		const symbolSetWithWS = new SymbolSelector(new Rule(), true).variant('Hello');

		expect(symbolSetWithWS.symbolSets[0].symbols[0].type).toBe('REGEXP');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].value).toBe('\\s*');
		expect(symbolSetWithWS.symbolSets[0].symbols[0].name).toBe(null);

		expect(symbolSetWithWS.symbolSets[0].symbols[1].type).toBe('VARIANT');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].value).toBe('Hello');
		expect(symbolSetWithWS.symbolSets[0].symbols[1].name).toBe(null);

		const symbolSet = new SymbolSelector(new Rule(), false).variant('Hello');

		expect(symbolSet.symbolSets[0].symbols[0].type).toBe('VARIANT');
		expect(symbolSet.symbolSets[0].symbols[0].value).toBe('Hello');
		expect(symbolSet.symbolSets[0].symbols[0].name).toBe(null);
	});
});