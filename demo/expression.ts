import { GrammarBuilder } from '../src/Grammar';
import { VariantBuilder } from '../src/Variant';
import { RuleBuilder } from '../src/Rule';

export const grammar = GrammarBuilder.create({
	expression: VariantBuilder.create([
		RuleBuilder.match.one.variant('term').capture('first')
			.followedBy.one.regexp(/[+-]/).capture('operator')
			.followedBy.one.variant('term').capture('second'),
		RuleBuilder.match.one.variant('term')
	]),

	term: VariantBuilder.create([
		RuleBuilder.match.one.variant('expression').capture('first')
			.followedBy.one.regexp(/[*\/]/).capture('operator')
			.followedBy.one.variant('expression').capture('second'),
		RuleBuilder.match.one.variant('expression').capture('value')
	]),
	int: VariantBuilder.create([
		RuleBuilder.match.one.regexp(/[0-9]+/),
		RuleBuilder.throw('Expected an Integer')
	])
});