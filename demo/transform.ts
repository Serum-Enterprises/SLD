import * as SLD from '../src/index';

const expression: SLD.RuleVariant = SLD.RuleVariant.create([
	// Addition and Subtraction
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('+')
		.followedBy(/\d+/, 'secondValue')
		.transform((nodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'ADD',
				VALUE: parseInt(nodes.firstValue.raw) + parseInt(nodes.secondValue.raw)
			};
		}),
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('-')
		.followedBy(/\d+/, 'secondValue')
		.transform((nodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'SUBTRACT',
				VALUE: parseInt(nodes.firstValue.raw) - parseInt(nodes.secondValue.raw)
			};
		})
]);

const input = {
	ADDITION: '1 + 2',
	SUBTRACTION: '1 - 2',
};

const output = {
	ADDITION: SLD.Parser.create(expression).parse(input.ADDITION),
	SUBTRACTION: SLD.Parser.create(expression).parse(input.SUBTRACTION)
};

console.log(JSON.stringify(output, null, 2));