const { Rule } = require('../src/Rule');
const { Grammar } = require('../src/Grammar');

describe('Testing Grammar', () => {
	test('Testing constructor', () => {
		expect(() => new Grammar(null)).toThrow(new TypeError('Expected rules to be an Object'));
		expect(() => new Grammar({ rule1: null })).toThrow(new TypeError('Expected rules.rule1 to be an Array'));
		expect(() => new Grammar({ rule1: ['Hello World'] })).toThrow(new TypeError('Expected rules.rule1[0] to be an instance of Rule'));

		expect(new Grammar()).toBeInstanceOf(Grammar);
		expect(new Grammar({})).toBeInstanceOf(Grammar);
		expect(new Grammar({ rule1: [] })).toBeInstanceOf(Grammar);
		expect(new Grammar({ rule1: [new Rule([])] })).toBeInstanceOf(Grammar);
	});

	test('Testing get rules', () => {
		const rule1 = new Rule([]);
		const rule2 = new Rule([]);

		expect((new Grammar({})).rules).toEqual({});
		expect((new Grammar({ rule1: [rule1] })).rules).toEqual({ rule1: [rule1] });
		expect((new Grammar({ rule1: [rule1], rule2: [rule2] })).rules).toEqual({ rule1: [rule1], rule2: [rule2] });
	});

	test('Testing set rules', () => {
		const rule1 = new Rule([]);
		const rule2 = new Rule([]);

		const grammar = new Grammar({});

		expect(() => grammar.rules = null).toThrow(new TypeError('Expected value to be an Object'));
		expect(() => grammar.rules = { rule1: null }).toThrow(new TypeError('Expected value.rule1 to be an Array'));
		expect(() => grammar.rules = { rule1: ['Hello World'] }).toThrow(new TypeError('Expected value.rule1[0] to be an instance of Rule'));

		grammar.rules = { rule1: [rule1] };
		expect(grammar.rules).toEqual({ rule1: [rule1] });

		grammar.rules = { rule1: [rule1], rule2: [rule2] };
		expect(grammar.rules).toEqual({ rule1: [rule1], rule2: [rule2] });
	});
});