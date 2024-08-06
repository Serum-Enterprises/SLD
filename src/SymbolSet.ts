import { Result, Ok } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';

import type { BaseSymbol } from './BaseSymbol';
import type { Grammar } from './Grammar';

export type ParseResult = { rest: string, namedNodes: Map<string, Node[]>, currentPrecedingNode: Option<Node> };

export class SymbolSet {
	private _symbols: BaseSymbol[];
	private _optional;
	private _greedy;

	constructor(symbols: BaseSymbol[], optional: boolean, greedy: boolean) {
		this._symbols = symbols;
		this._optional = optional;
		this._greedy = greedy;
	}

	get symbols() {
		return this._symbols;
	}

	get optional() {
		return this._optional;
	}

	get greedy() {
		return this._greedy;
	}

	parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<ParseResult, ParseError> {
		let rest: string = source;
		let currentPrecedingNode: Option<Node> = precedingNode;
		const namedNodes: Map<string, Node[]> = new Map();

		// Match every Symbol in the SymbolSet
		for (let baseSymbol of this._symbols) {
			const parseResult: Result<Node, ParseError> = baseSymbol.parse(rest, currentPrecedingNode, grammarContext);

			if (parseResult.isErr()) {
				if (this._optional)
					continue;
				else
					return parseResult;					// TODO: Check if the Stack needs to be updated
			}
			else {
				const result: Node = (parseResult as Ok<Node>).value;

				baseSymbol.name.match(
					name => {
						if(!namedNodes.has(name))
							namedNodes.set(name, []);

						(namedNodes.get(name) as Node[]).push(result);
					},
					() => { }
				);

				rest = rest.slice(result.raw.length);
				currentPrecedingNode = Option.Some(result);
			}
		}

		return Result.Ok({
			rest,
			namedNodes,
			currentPrecedingNode
		});
	}
}