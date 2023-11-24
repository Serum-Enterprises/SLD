import { Variant } from '../src/Variant';
import { Rule } from '../src/Rule';

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
							components: [
								{
									type: 'STRING',
									value: 'Hello',
									name: null
								}
							],
							greedy: false,
							optional: false
						}
					],
					throwMessage: null,
					recoverComponent: null
				}
			]);
	});

});