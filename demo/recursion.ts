import * as SLD from '../src/index';

const expression: SLD.Variant = SLD.Variant.create([
	// Addition and Subtraction
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('+')
		.followedBy(SLD.MatchEngine.matchRuleVariant('expression'), 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return parseInt(childNodes.firstValue.raw) + (childNodes.secondValue.data as number);
		}),
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('-')
		.followedBy(SLD.MatchEngine.matchRuleVariant('expression'), 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return parseInt(childNodes.firstValue.raw) - (childNodes.secondValue.data as number);
		}),

	// Incomplete Expressions
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('+')
		.throw('Expected an Expression after the "+" operator'),

	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('-')
		.throw('Expected an Expression after the "-" operator'),

	// Single-Value Expression
	SLD.Rule.begin(/\d+/, 'value')
		.transform((childNodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return parseInt(childNodes.value.raw);
		}),

	// Missing Expression
	SLD.Rule.throw('Expected an Expression')
]);

const input = '1 + 2 - 3 + 4 - 5';

const output = SLD.Parser.create(expression, [
	['expression', expression]
]).parse(input);

console.log(JSON.stringify(output, null, 2));