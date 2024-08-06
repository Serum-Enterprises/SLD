import { Result, Err } from './Util';
import { Option, Some } from './Util';
import { Node, ParseError } from './Util';

import { BaseSymbol } from './BaseSymbol';
import { SymbolSet } from './SymbolSet';
import type { Grammar } from './Grammar';

export class Rule {
	static get match(): QuantitySelector {
		return new QuantitySelector(new Rule([], Option.None(), Option.None(), node => node), false, false);
	}

	static throw(message: string): Rule {
		return new Rule([], Option.Some(message), Option.None(), node => node);
	}

	private _symbolSets: SymbolSet[];
	private _throwMessage: Option<string>;
	private _recoverySymbol: Option<BaseSymbol>;
	private _transformer: (node: Node) => Node;

	constructor(symbolSets: SymbolSet[], throwMessage: Option<string>, recoverySymbol: Option<BaseSymbol>, transformer: (node: Node) => Node) {
		this._symbolSets = symbolSets;
		this._throwMessage = throwMessage;
		this._recoverySymbol = recoverySymbol;
		this._transformer = transformer;
	}

	get symbolSets(): SymbolSet[] {
		return this._symbolSets;
	}

	get throwMessage(): Option<string> {
		return this._throwMessage;
	}

	get recoverySymbol(): Option<BaseSymbol> {
		return this._recoverySymbol;
	}

	get transformer(): (node: Node) => Node {
		return this._transformer;
	}

	get recover(): SymbolSelector {
		return new SymbolSelector(this, false, false, false, true);
	}

	throw(message: string): Rule {
		this._throwMessage = Option.Some(message);

		return this;
	}

	get followedBy(): QuantitySelector {
		return new QuantitySelector(this, true, false);
	}

	get directlyFollowedBy(): QuantitySelector {
		return new QuantitySelector(this, false, false);
	}

	transform(transformer: (node: Node) => Node): Rule {
		this._transformer = transformer;

		return this;
	}

	/**
	 * Parse the give source with the Rule
	 */
	parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError> {
		let rest: string = source;
		let currentPrecedingNode: Option<Node> = precedingNode;
		let namedNodes: Map<string, Node[]> = new Map();

		// If a Custom Throw Message was set, throw an Error
		if (this._throwMessage.isSome())
			return Result.Err({		// TODO: Check if the Error Stack needs to be updated
				message: (this._throwMessage as Some<string>).value,
				location: precedingNode.match(node => node.range[1] + 1, () => 0),
				stack: [{ source, precedingNode, grammarContext }]
			});

		// Loop through all SymbolSets
		for (const symbolSet of this._symbolSets) {
			const parseResult = symbolSet.parse(rest, currentPrecedingNode, grammarContext);

			if (parseResult.isOk()) {
				// If there was no Error, update the rest, namedNodes and currentPrecedingNode
				rest = parseResult.value.rest;
				namedNodes = Node.mergeNodeMaps([namedNodes, parseResult.value.namedNodes]);
				currentPrecedingNode = parseResult.value.currentPrecedingNode;

				// If the SymbolSet is greedy, try to match until there is an Error and always update rest, namedNodes and currentPrecedingNode
				if (symbolSet.greedy) {
					while (true) {
						const parseResult = symbolSet.parse(rest, currentPrecedingNode, grammarContext);

						if (parseResult.isOk()) {
							rest = parseResult.value.rest;
							namedNodes = Node.mergeNodeMaps([namedNodes, parseResult.value.namedNodes]);
							currentPrecedingNode = parseResult.value.currentPrecedingNode;
						} else {
							break;
						}
					}
				}
			}
			else {
				// If there was an Error and the SymbolSet is optional, continue with the next SymbolSet
				if (symbolSet.optional)
					continue;

				// If the SymbolSet is not optional, check if the recoverSymbol is set
				if (this._recoverySymbol.isSome()) {
					const recoverResult = (this.recoverySymbol as Some<BaseSymbol>).value.find(source, currentPrecedingNode, grammarContext);

					// If the recoverSymbol was found, return it's Node, otherwise propagate the Error
					if (recoverResult.isSome())
						return Result.Ok(recoverResult.value);

					// TODO: Check if the Error Stack needs to be updated
					return Result.Err((parseResult as Err<ParseError>).error);
				}

				// If the SymbolSet is not optional and no recoverSymbol was set, propagate the Error
				// TODO: Check if the Error Stack needs to be updated
				return Result.Err((parseResult as Err<ParseError>).error);
			}
		}

		// Create the result Node
		const node = Node.createFollowerWith(precedingNode, source.slice(0, source.length - rest.length), Option.Some(namedNodes));

		// Run the Node through the transformer and return the Result
		return Result.Ok(this._transformer(node));
	}
}

class QuantitySelector {
	private _rule: Rule;
	private _whiteSpacePrefix: boolean;
	private _recoverySymbol: boolean;

	constructor(rule: Rule, whitespacePrefix: boolean, recoverySymbol: boolean) {
		this._rule = rule;
		this._whiteSpacePrefix = whitespacePrefix;
		this._recoverySymbol = recoverySymbol;
	}

	get rule(): Rule {
		return this._rule;
	}

	get whitespacePrefix(): boolean {
		return this._whiteSpacePrefix;
	}

	get recoverSymbol(): boolean {
		return this._recoverySymbol;
	}

	get one(): SymbolSelector {
		return new SymbolSelector(this._rule, this._whiteSpacePrefix, false, false, this._recoverySymbol);
	}

	get zeroOrOne(): SymbolSelector {
		return new SymbolSelector(this._rule, this._whiteSpacePrefix, true, false, this._recoverySymbol);
	}

	get zeroOrMore(): SymbolSelector {
		return new SymbolSelector(this._rule, this._whiteSpacePrefix, true, true, this._recoverySymbol);
	}

	get oneOrMore(): SymbolSelector {
		return new SymbolSelector(this._rule, this._whiteSpacePrefix, false, true, this._recoverySymbol);
	}
}

class SymbolSelector {
	private _rule: Rule;
	private _whiteSpacePrefix: boolean;
	private _optional: boolean;
	private _greedy: boolean;
	private _recoverySymbol: boolean;

	constructor(rule: Rule, whitespacePrefix: boolean, optional: boolean, greedy: boolean, recoverySymbol: boolean) {
		this._rule = rule;
		this._whiteSpacePrefix = whitespacePrefix;
		this._optional = optional;
		this._greedy = greedy;
		this._recoverySymbol = recoverySymbol;
	}

	get rule(): Rule {
		return this._rule;
	}

	get whitespacePrefix(): boolean {
		return this._whiteSpacePrefix;
	}

	get optional(): boolean {
		return this._optional;
	}

	get greedy(): boolean {
		return this._greedy;
	}

	get recoverSymbol(): boolean {
		return this._recoverySymbol;
	}

	string(value: string, name: string = ''): Rule {
		if (this._recoverySymbol)
			return new Rule(
				this._rule.symbolSets,
				this._rule.throwMessage,
				Option.Some(new BaseSymbol('STRING', value, name.length === 0 ? Option.None() : Option.Some(name))),
				this._rule.transformer
			);
		else
			return new Rule(
				[
					...this._rule.symbolSets,
					new SymbolSet([
						...(this._whiteSpacePrefix ? [new BaseSymbol('REGEXP', /\s*/, Option.None())] : []),
						new BaseSymbol('STRING', value, name.length === 0 ? Option.None() : Option.Some(name))
					], this._optional, this._greedy)
				],
				this._rule.throwMessage,
				this._rule.recoverySymbol,
				this._rule.transformer
			);
	}

	regexp(value: RegExp, name: string = ''): Rule {
		if (this._recoverySymbol)
			return new Rule(
				this._rule.symbolSets,
				this._rule.throwMessage,
				Option.Some(new BaseSymbol('REGEXP', value, name.length === 0 ? Option.None() : Option.Some(name))),
				this._rule.transformer
			);
		else
			return new Rule(
				[
					...this._rule.symbolSets,
					new SymbolSet([
						...(this._whiteSpacePrefix ? [new BaseSymbol('REGEXP', /\s*/, Option.None())] : []),
						new BaseSymbol('REGEXP', value, name.length === 0 ? Option.None() : Option.Some(name))
					], this._optional, this._greedy)
				],
				this._rule.throwMessage,
				this._rule.recoverySymbol,
				this._rule.transformer
			);
	}

	ruleset(value: string, name: string = ''): Rule {
		if (this._recoverySymbol)
			return new Rule(
				this._rule.symbolSets,
				this._rule.throwMessage,
				Option.Some(new BaseSymbol('RULESET', value, name.length === 0 ? Option.None() : Option.Some(name))),
				this._rule.transformer
			);
		else
			return new Rule(
				[
					...this._rule.symbolSets,
					new SymbolSet([
						...(this._whiteSpacePrefix ? [new BaseSymbol('REGEXP', /\s*/, Option.None())] : []),
						new BaseSymbol('RULESET', value, name.length === 0 ? Option.None() : Option.Some(name))
					], this._optional, this._greedy)
				],
				this._rule.throwMessage,
				this._rule.recoverySymbol,
				this._rule.transformer
			);
	}
}