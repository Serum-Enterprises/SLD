import { Component, ComponentInterface } from '../src/Component';
import { RuleBuilder, Rule, RuleInterface } from '../src/Rule';

describe("Testing Rule", () => {
	test('Testing static fromJSON', () => {
		const rule: RuleInterface = {
			components: [
				{
					type: 'STRING',
					value: 'testValue',
					name: 'testName',
					greedy: true,
					optional: false
				}
			],
			throwMessage: 'testThrowMessage',
			recoverComponent: null
		};

		expect(Rule.fromJSON(rule)).toBeInstanceOf(Rule);
	});

	test('Testing constructor', () => {
		const component = new Component('STRING', 'testValue', 'testName', true, false);

		expect(new Rule([component], 'testThrowMessage', null)).toBeInstanceOf(Rule);
	});

	test('Testing toJSON', () => {
		const component = new Component('STRING', 'testValue', 'testName', true, false);

		expect(new Rule([component], 'testThrowMessage', null).toJSON()).toStrictEqual({
			components: [component.toJSON()],
			throwMessage: 'testThrowMessage',
			recoverComponent: null
		});
	});
});