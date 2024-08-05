import { Result, Ok, Err } from './Util';
import { Option, Some, None } from './Util';
import { Node, ParseError } from './Util';

import type { Rule } from './Rule';
import type { Grammar } from './Grammar';

export class RuleSet {
	static create(rules: Rule[] = []): RuleSet {
		return new RuleSet(rules, node => node);
	}

	private _rules: Rule[];
	private _transformer: (node: Node) => Node;

	constructor(rules: Rule[], transformer: (node: Node) => Node) {
		this._rules = rules;
		this._transformer = transformer;
	}

	/**
	 * Set a Transformer function for this RuleSet
	 * @param {(node: Parser.Node) => Parser.Node} transformer 
	 * @returns {RuleSet}
	 */
	transform(transformer: (node: Node) => Node): RuleSet {
		this._transformer = transformer;

		return this;
	}

	get rules(): Rule[] {
		return this._rules;
	}

	get transformer(): (node: Node) => Node {
		return this._transformer;
	}

	parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError> {
		let result: Option<Node> = Option.None();
		let errors: ParseError[] = [];

		for (const rule of this._rules) {
			const parseResult = rule.parse(source, precedingNode, grammarContext);

			if (parseResult.isOk()) {
				result = parseResult.OkToOption();
				break;
			}
			else {
				errors.push((parseResult as Err<ParseError>).error);
			}
		}

		if (result.isNone())
			return Result.Err({
				message: `Unable to Parse a Rule`,
				location: precedingNode.match(node => node.range[1] + 1, () => 0),
				// TODO: Check if the Error Stack needs to be updated
				stack: [{ source, precedingNode, grammarContext }]
			});

		// Run the Node through the transformer and return the Result
		return Result.Ok(this._transformer((result as Some<Node>).value));
	}
}