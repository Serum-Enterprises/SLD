const { RuleSet } = require('../src/RuleSet');

describe('Testing RuleSet', () => {
	test('Testing static create', () => {
		expect(RuleSet.create()).toBeInstanceOf(RuleSet);
	});

	test('Testing transform', () => {
		expect(() => RuleSet.create().transform()).toThrow(new TypeError('Expected transformer to be a Function'));

		const ruleSet = RuleSet.create();

		expect(ruleSet.transform(() => { })).toBeInstanceOf(RuleSet);
		expect(ruleSet.transformer).toBeInstanceOf(Function);
	});
});