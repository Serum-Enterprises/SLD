import { Grammar } from '../../Builder/Grammar';
import { Variant } from '../../Builder/Variant';
import { Rule } from '../../Builder/Rule';

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
				]
			});
	});

});