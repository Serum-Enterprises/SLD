import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';

import type { Grammar } from './Grammar';

export class BaseSymbol {
	private _type: "STRING" | "REGEXP" | "RULESET";
	private _value: string | RegExp;
	private _name: Option<string>;

	constructor(type: "STRING" | "RULESET", value: string, name: Option<string>);
	constructor(type: "REGEXP", value: RegExp, name: Option<string>);
	constructor(type: "STRING" | "REGEXP" | "RULESET", value: string | RegExp, name: Option<string>) {
		this._type = type;
		this._value = value;
		this._name = name;
	}

	get type(): "STRING" | "REGEXP" | "RULESET" {
		return this._type;
	}

	get value(): string | RegExp {
		return this._value;
	}

	get name(): Option<string> {
		return this._name;
	}

	find(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Option<Node> {
		let rest = source;
		let result: Option<Node> = Option.None();

		while (result.isNone() && rest.length > 0) {
			const parseResult = this.parse(rest, precedingNode, grammarContext);

			result = parseResult.OkToOption();
			rest = rest.slice(1);
		}

		return result.mapSome(node => Node.createFollowerWith(Option.Some(node), node.raw, Option.None()));
	}

	parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError> {
		switch (this._type) {
			case 'STRING': {
				if (!source.startsWith(this._value as string))
					return Result.Err({
						message: `Expected ${this._value as string}`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});

				return Result.Ok(Node.createFollowerWith(precedingNode, this._value as string, Option.None()));
			}
			case 'REGEXP': {
				const match = source.match((this._value as RegExp).source.startsWith('^') ? this._value : new RegExp(`^${(this._value as RegExp).source}`, (this._value as RegExp).flags));

				if (!match)
					return Result.Err({
						message: `Expected ${this._value.toString()}`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});

				if (match[0].length === 0)
					return Result.Err({
						message: `Empty Match`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});

				return Result.Ok(Node.createFollowerWith(precedingNode, match[0], Option.None()));
			}
			case 'RULESET': {
				// TODO: Check if the Stack needs to be updated
				return (grammarContext.ruleSets[this._value as string]).parse(source, precedingNode, grammarContext);
			}
		}
	}
}