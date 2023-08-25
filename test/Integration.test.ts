import { RuleBuilder } from '../src/Rule';
import { VariantBuilder } from '../src/Variant';
import { GrammarBuilder } from '../src/Grammar';

describe('Testing Integration of Parse', () => {
	test('Testing a simple non-recursive Grammar', () => {
		const source = 'Hello from World 123456';
		const grammar = GrammarBuilder.create({
			greeting: VariantBuilder.create([
				RuleBuilder.match.one.variant('word').capture('first')
					.followedBy.one.variant('word', 'second')
					.followedBy.one.variant('word', 'third')
					.followedBy.one.variant('number', 'number')
					.directlyFollowedBy.zeroOrMore.string('.'),
			]),
			word: VariantBuilder.create([
				RuleBuilder.match.one.string('Hello'),
				RuleBuilder.match.one.string('from'),
				RuleBuilder.match.one.string('World'),
				RuleBuilder.throw('Expected a Word')
			]),
			number: VariantBuilder.create([
				RuleBuilder.match.oneOrMore.regexp(/[0-9]/),
				RuleBuilder.throw('Expected a Number')
			])
		});

		console.log(JSON.stringify(grammar.parse(source, 'greeting').toJSON(), null, 2));
		expect(() => grammar.parse(source, 'greeting')).not.toThrow();
	});

	test('Testing a Grammar with direct Recursion', () => {
		const source = '1 + 2 + 3 + 4';
		const grammar = GrammarBuilder.create({
			expression: VariantBuilder.create([
				RuleBuilder.match.one.variant('expression').capture('first')
					.followedBy.one.regexp(/[+-]/).capture('operator')
					.followedBy.one.variant('expression').capture('second'),
				RuleBuilder.match.one.variant('int')
			]),
			int: VariantBuilder.create([
				RuleBuilder.match.one.regexp(/[0-9]+/),
				RuleBuilder.throw('Expected an Integer')
			])
		});

		console.log(JSON.stringify(grammar.parse(source, 'expression').toJSON(), null, 2));
		expect(() => grammar.parse(source, 'expression')).not.toThrow();
	});

	test('Testing a Grammar with Indirect Recursion', () => {
		const source = '(1 + (2 - 3) + 4)';

		const grammar = GrammarBuilder.create({
			expression: VariantBuilder.create([
				RuleBuilder.match.one.variant('parens').capture('value'),
				RuleBuilder.match.one.variant('expression').capture('first')
					.followedBy.one.regexp(/[+-]/).capture('operator')
					.followedBy.one.variant('expression').capture('second'),
				RuleBuilder.match.one.variant('int').capture('value'),
			]),
			parens: VariantBuilder.create([
				RuleBuilder.match.one.string('(')
					.followedBy.one.variant('expression').capture('innerExpression')
					.followedBy.one.string(')'),
				RuleBuilder.throw('Expected a Parentheses Group')
			]),
			int: VariantBuilder.create([
				RuleBuilder.match.one.regexp(/[0-9]+/),
				RuleBuilder.throw('Expected an Integer')
			])
		});

		console.log(JSON.stringify(grammar.parse(source, 'expression').toJSON(), null, 2));
		expect(() => grammar.parse(source, 'expression')).not.toThrow();
	});
});
