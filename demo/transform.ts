import * as SLD from '../src/index';

const expression: SLD.Variant = SLD.Variant.create([
	// Addition and Subtraction
	SLD.Rule.matchOne(/\d+/, 'firstValue')
		.followedByOne('+')
		.followedByOne(/\d+/, 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node | SLD.Node[] }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'ADD',
				VALUE: parseInt((childNodes.firstValue as SLD.Node).raw) + parseInt((childNodes.secondValue as SLD.Node).raw)
			};
		}),
	SLD.Rule.matchOne(/\d+/, 'firstValue')
		.followedByOne('-')
		.followedByOne(/\d+/, 'secondValue')
		.transform((childNodes: { [key: string]: SLD.Node | SLD.Node[] }, raw: string, meta: SLD.Meta) => {
			return {
				TYPE: 'SUBTRACT',
				VALUE: parseInt((childNodes.firstValue as SLD.Node).raw) - parseInt((childNodes.secondValue as SLD.Node).raw)
			};
		})
]);

const input = {
	ADDITION: '1 + 2',
	SUBTRACTION: '1 - 2',
};

export const output = {
	ADDITION: SLD.Parser.create(expression).parse(input.ADDITION, true, true),
	SUBTRACTION: SLD.Parser.create(expression).parse(input.SUBTRACTION, true, true)
};