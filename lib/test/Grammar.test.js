const { RuleSet } = require('../src/RuleSet');
const { Grammar } = require('../src/Grammar');

describe('Testing Grammar', () => {
	test('Testing constructor', () => {
		expect(() => new Grammar(null)).toThrow(new TypeError('Expected ruleSets to be an Object'));
		expect(() => new Grammar({ ruleSet1: null })).toThrow(new TypeError('Expected ruleSets.ruleSet1 to be an instance of RuleSet'));

		expect(new Grammar()).toBeInstanceOf(Grammar);
		expect(new Grammar({})).toBeInstanceOf(Grammar);
		expect(new Grammar({ ruleSet1: new RuleSet() })).toBeInstanceOf(Grammar);
	});

	test('Testing get ruleSets', () => {
		const ruleSet1 = new RuleSet();
		const ruleSet2 = new RuleSet();

		expect((new Grammar({})).ruleSets).toEqual({});
		expect((new Grammar({ ruleSet1 })).ruleSets).toEqual({ ruleSet1 });
		expect((new Grammar({ ruleSet1, ruleSet2 })).ruleSets).toEqual({ ruleSet1, ruleSet2 });
	});

	test('Testing set ruleSets', () => {
		const ruleSet1 = new RuleSet();
		const ruleSet2 = new RuleSet();

		const grammar = new Grammar({});

		expect(() => grammar.ruleSets = null).toThrow(new TypeError('Expected value to be an Object'));
		expect(() => grammar.ruleSets = { ruleSet1: null }).toThrow(new TypeError('Expected value.ruleSet1 to be an instance of RuleSet'));

		grammar.ruleSets = { ruleSet1 };
		expect(grammar.ruleSets).toEqual({ ruleSet1 });

		grammar.ruleSets = { ...grammar.ruleSets, ruleSet2 };
		expect(grammar.ruleSets).toEqual({ ruleSet1, ruleSet2 });
	});

	test('Testing debug', () => {
		const ruleSet1 = new RuleSet();
		const ruleSet2 = new RuleSet();

		const grammar = new Grammar({ ruleSet1, ruleSet2 });

		expect(grammar.debug()).toEqual({ ruleSets: { ruleSet1: ruleSet1.debug(), ruleSet2: ruleSet2.debug() } });
	});
});