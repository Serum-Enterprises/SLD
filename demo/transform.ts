import * as SLD from '../src/index';

const expression: SLD.Variant = SLD.Variant.create([
	// Addition and Subtraction
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('+')
		.followedBy(/\d+/, 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'ADD',
				VALUE: parseInt(childNodes.firstValue.raw) + parseInt(childNodes.secondValue.raw)
			};
		}),
	SLD.Rule.begin(/\d+/, 'firstValue')
		.followedBy('-')
		.followedBy(/\d+/, 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'SUBTRACT',
				VALUE: parseInt(childNodes.firstValue.raw) - parseInt(childNodes.secondValue.raw)
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