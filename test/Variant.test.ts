import { Component, ComponentInterface } from '../src/Component';
import { Rule, RuleInterface } from '../src/Rule';
import { Variant, VariantInterface } from '../src/Variant';

describe("Testing Variant", () => {
	test('Testing static fromJSON', () => {
		const variant: VariantInterface = [
			{
				components: [],
				throwMessage: 'testThrowMessage',
				recoverComponent: null
			},
			{
				components: [],
				throwMessage: null,
				recoverComponent: null
			}
		];

		expect(Variant.fromJSON(variant)).toBeInstanceOf(Variant);
	});

	test('Testing constructor', () => {
		const rule = Rule.fromJSON({
			components: [],
			throwMessage: 'testThrowMessage',
			recoverComponent: null
		});

		expect(new Variant([rule, rule])).toBeInstanceOf(Variant);
	});

	test('Testing addRule', () => {
		const rule = Rule.fromJSON({
			components: [],
			throwMessage: 'testThrowMessage',
			recoverComponent: null
		});

		expect(new Variant().addRule(rule)).toBeInstanceOf(Variant);
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