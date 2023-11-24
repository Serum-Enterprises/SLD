import { Grammar } from '../src/Grammar';
import { Variant } from '../src/Variant';
import { Rule } from '../src/Rule';

describe("Testing Grammar", () => {
	test('Testing static create', () => {
		expect(() => Grammar.create()).not.toThrow();
		expect(Grammar.create()).toBeInstanceOf(Grammar);
	});

	test('Testing addVariant', () => {
		expect(Grammar.create().addVariant('helloVariant', Variant.create([
			Rule.match.one.string('Hello')
		]))).toBeInstanceOf(Grammar);
	});

	test('Testing toJSON', () => {
		expect(Grammar.create({
			'helloVariant': Variant.create([
				Rule.match.one.string('Hello')
			])
		}).toJSON())
			.toStrictEqual({
				'helloVariant': [
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
				]
			});
	});

});