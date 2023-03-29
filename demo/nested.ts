import * as SLD from '../src/index';

const Expression: SLD.Variant = SLD.Variant.create([
	SLD.Rule.matchOne(/\d+/, 'value')
		.followedByZeroOrMore(SLD.MatchEngine.matchVariant('expressionPart'), 'expressionParts')
		.transform((childNodes: { [key: string]: SLD.Node | SLD.Node[] }, raw: string, meta: SLD.Meta) => {
			let result: number = parseInt((childNodes.value as SLD.Node).raw);

			(childNodes.expressionParts as SLD.Node[]).forEach((node: SLD.Node) => {
				const childNodes = node.childNodes as { operator: SLD.Node, value: SLD.Node };

				const operator = childNodes.operator.raw;
				const value = parseInt(childNodes.value.raw);

				if (operator === '+')
					result += value;

				if (operator === '-')
					result -= value;
			});

			return result;
		}),

	// Missing Expression
	SLD.Rule.throw('Expected an Expression')
]);

const ExpressionPart: SLD.Variant = SLD.Variant.create([
	SLD.Rule.matchZeroOrOne(SLD.MatchEngine.matchWhitespace(), null)
		.followedByOne(/[-+]/, 'operator')
		.followedByOne(/\d+/, 'value'),

	SLD.Rule.matchOne(/[-+]/, 'operator')
		.throw('Expected a Value after the operator'),

	// Missing ExpressionPart
	SLD.Rule.throw('Expected an ExpressionPart')
]);

const input = '1 + 2 - 3 + 4 - 5';

export const output = SLD.Parser.create(Expression, [
	['expressionPart', ExpressionPart]
]).parse(input, true, true);