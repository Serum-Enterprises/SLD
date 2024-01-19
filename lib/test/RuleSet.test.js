const { Rule } = require('../src/Rule');
const { RuleSet } = require('../src/RuleSet');

describe('Testing RuleSet', () => {
	test('Testing constructor', () => {
		expect(() => new RuleSet(null)).toThrow(new TypeError('Expected rules to be an Array'));
		expect(() => new RuleSet([null])).toThrow(new TypeError('Expected rules[0] to be an instance of Rule'));
		expect(() => new RuleSet([], 123)).toThrow(new TypeError('Expected transformer to be a Function or null'));

		expect(new RuleSet()).toBeInstanceOf(RuleSet);
		expect(new RuleSet([])).toBeInstanceOf(RuleSet);
		expect(new RuleSet([new Rule()])).toBeInstanceOf(RuleSet);
		expect(new RuleSet([new Rule()], () => { })).toBeInstanceOf(RuleSet);
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

	test('Testing get transformer', () => {
		expect((new RuleSet([])).transformer).toBe(null);
		expect((new RuleSet([], () => { })).transformer).toBeInstanceOf(Function);
	});

	test('Testing set transformer', () => {
		const ruleSet = new RuleSet([]);

		expect(() => ruleSet.transformer = 123).toThrow(new TypeError('Expected value to be a Function or null'));

		ruleSet.transformer = () => { };
		expect(ruleSet.transformer).toBeInstanceOf(Function);
	});

	test('Testing debug', () => {
		const rule = new Rule([]);

		expect(new RuleSet([rule]).debug()).toEqual({ rules: [rule.debug()], transformer: null });
		expect(new RuleSet([rule], () => {}).debug(true)).toEqual({ rules: [rule.debug(true)], transformer: 'function' });
	})
});