import { Grammar, Variant, Rule } from '../Builder';
import { Grammar as Parser } from '../Parser/Grammar';

describe('Testing Integration', () => {
	test('Basic Grammar', () => {
		const grammar = Grammar.create({
			greeting: Variant.create([
				Rule.match.one.string('Hello')
					.followedBy.one.string('World'),
				Rule.match.one.string('Hello')
			]),
			goodbye: Variant.create([
				Rule.match.one.string('Goodbye')
					.followedBy.zeroOrOne.string('World'),
				Rule.match.one.string('Goodbye')
			])
		});

		expect(Parser.fromJSON(grammar.toJSON()).parse('Hello World', 'greeting').toJSON()).toEqual({
			type: 'MATCH',
			raw: 'Hello World',
			children: {},
			range: [0, 10]
		});
	});

	test('Linked Grammar', () => {
		const grammar = Grammar.create({
			calc: Variant.create([
				Rule.match.one.variant('int')
					.followedBy.zeroOrMore.variant('op'),
				Rule.throw('Expected a Calculation')
			]),
			op: Variant.create([
				Rule.match.one.regexp(/[+-]/)
					.followedBy.one.variant('int')
			]),
			int: Variant.create([
				Rule.match.one.regexp(/[0-9]+/),
				Rule.throw('Expected an Integer')
			])
		});

		expect(Parser.fromJSON(grammar.toJSON()).parse('1 + 2 + 3', 'calc').toJSON())
			.toEqual({
				type: 'MATCH',
				raw: '1 + 2 + 3',
				children: {},
				range: [0, 8]
			});

		/*
		{
			type: 'MATCH',
			raw: '1 + 2 +',
			children: {},
			range: [0, 6]
		}
		*/
	});
});