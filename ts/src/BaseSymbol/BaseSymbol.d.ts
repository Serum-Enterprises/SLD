import { Result, Option, ParseError } from '../Util';

import type { Grammar } from '../Grammar/Grammar';

export class BaseSymbol {
	constructor(type: "STRING" | "RULESET", value: string, name: Option<string>);
	constructor(type: "REGEXP", value: RegExp, name: Option<string>);
	constructor(type: "STRING" | "REGEXP" | "RULESET", value: string | RegExp, name: Option<string>);

	get type(): "STRING" | "REGEXP" | "RULESET";
	get value(): string | RegExp;
	get name(): Option<string>;

	find(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Option<Node>;
	parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError>
}