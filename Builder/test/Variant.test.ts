import { Variant } from '../../Builder/Variant';
import { Rule } from '../../Builder/Rule';

describe("Testing Variant", () => {
	test('Testing static create', () => {
		expect(() => Variant.create()).not.toThrow();
		expect(Variant.create()).toBeInstanceOf(Variant);
	});

	test('Testing addRule', () => {
		expect(Variant.create().addRule(
			Rule.match.one.string('Hello')
		)).toBeInstanceOf(Variant);
	});

	test('Testing toJSON', () => {
		expect(Variant.create([Rule.match.one.string('Hello')]).toJSON())
			.toStrictEqual([
				{
					components: [
						{
							type: 'STRING',
							value: 'Hello',
							name: null,
							greedy: false,
							optional: false,
							prefix: null
						}
					],
					throwMessage: null,
					recoverComponent: null
				}
			]);
	});

});