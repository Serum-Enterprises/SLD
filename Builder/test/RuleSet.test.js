const { RuleSet } = require('../src/RuleSet');

describe('Testing RuleSet', () => {
	test('Testing static create', () => {
		expect(RuleSet.create()).toBeInstanceOf(RuleSet);
	});
});