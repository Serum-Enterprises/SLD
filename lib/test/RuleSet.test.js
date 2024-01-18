const { Rule } = require('../src/Rule');
const { RuleSet } = require('../src/RuleSet');

describe('Testing RuleSet', () => {
	test('Testing constructor', () => {
		expect(() => new RuleSet(null)).toThrow(new TypeError('Expected rules to be an Array'));
		expect(() => new RuleSet([null])).toThrow(new TypeError('Expected rules[0] to be an instance of Rule'));

		expect(new RuleSet()).toBeInstanceOf(RuleSet);
		expect(new RuleSet([])).toBeInstanceOf(RuleSet);
		expect(new RuleSet([new Rule()])).toBeInstanceOf(RuleSet);
	});

	test('Testing get rules', () => {
		const rule = new Rule([]);

		expect((new RuleSet([])).rules).toEqual([]);
		expect((new RuleSet([rule])).rules).toEqual([rule]);
	});

	test('Testing set rules', () => {
		const rule = new Rule([]);
		const ruleSet = new RuleSet([]);

		expect(() => ruleSet.rules = null).toThrow(new TypeError('Expected value to be an Array'));
		expect(() => ruleSet.rules = [null]).toThrow(new TypeError('Expected value[0] to be an instance of Rule'));

		ruleSet.rules = [rule];
		expect(ruleSet.rules).toEqual([rule]);
	});
});