import * as Meta from '../lib/Meta';
import * as Node from '../lib/Node';
import * as Problem from '../lib/Problem';
import * as Result from '../lib/Result';
import * as MatchEngine from './MatchEngine';
import { Parser } from './Parser';

export type transformFunction = (childNodes: { [key: string]: Node.Node | Node.Node[] }, raw: string, meta: Meta.Meta) => unknown;

export class Match {
	static one(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return Rule.matchOne(matcher, name);
	}
	static zeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return Rule.matchZeroOrOne(matcher, name);
	}
	static zeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return Rule.matchZeroOrMore(matcher, name);
	}
	static oneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return Rule.matchOneOrMore(matcher, name);
	}
}

export class FollowedBy {
	private _rule: Rule;

	constructor(rule: Rule) {
		this._rule = rule;
	}

	one(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.followedByOne(matcher, name);
	}
	zeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.followedByZeroOrOne(matcher, name);
	}
	zeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.followedByZeroOrMore(matcher, name);
	}
	oneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.followedByOneOrMore(matcher, name);
	}
}

export class DirectlyFollowedBy {
	private _rule: Rule;

	constructor(rule: Rule) {
		this._rule = rule;
	}

	one(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.directlyFollowedByOne(matcher, name);
	}
	zeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.directlyFollowedByZeroOrOne(matcher, name);
	}
	zeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.directlyFollowedByZeroOrMore(matcher, name);
	}
	oneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return this._rule.directlyFollowedByOneOrMore(matcher, name);
	}
}

export class Rule {
	private _matchers: { matchFunction: MatchEngine.matchFunction, name: null | string, optional: boolean, greedy: boolean }[];
	private _transformer: transformFunction | null;
	private _throwMessage: null | string;
	private _globalThrowMessage: null | string;
	private _recover: null | MatchEngine.matchFunction;

	private constructor() {
		this._matchers = [];
		this._transformer = null;
		this._throwMessage = null;
		this._globalThrowMessage = null;
		this._recover = null;
	}

	public static get match(): typeof Match {
		return Match;
	}
	public static matchOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return (new Rule()).directlyFollowedByOne(matcher, name);
	}
	public static matchZeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return (new Rule()).directlyFollowedByZeroOrOne(matcher, name);
	}
	public static matchZeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return (new Rule()).directlyFollowedByZeroOrMore(matcher, name);
	}
	public static matchOneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		return (new Rule()).directlyFollowedByOneOrMore(matcher, name);
	}

	public static throw(message: string): Rule {
		const rule = new Rule();

		rule._globalThrowMessage = message;

		return rule;
	}

	public get followedBy(): FollowedBy {
		return new FollowedBy(this);
	}
	public get directlyFollowedBy(): DirectlyFollowedBy {
		return new DirectlyFollowedBy(this);
	}

	public followedByOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		this._matchers.push({ matchFunction: MatchEngine.matchWhitespace(), name: null, optional: true, greedy: false });

		return this.directlyFollowedByOne(matcher, name);
	}
	public directlyFollowedByOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		if (typeof matcher === 'function')
			this._matchers.push({ matchFunction: matcher, name, optional: false, greedy: false });
		else if (typeof matcher === 'string')
			this._matchers.push({ matchFunction: MatchEngine.matchString(matcher), name, optional: false, greedy: false });
		else if (matcher instanceof RegExp)
			this._matchers.push({ matchFunction: MatchEngine.matchRegex(matcher), name, optional: false, greedy: false });
		else
			throw new TypeError('Expected matcher to be a String, RegExp or Function');

		return this;
	}

	public followedByZeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		this._matchers.push({ matchFunction: MatchEngine.matchWhitespace(), name: null, optional: true, greedy: false });

		return this.directlyFollowedByOne(matcher, name);
	}
	public directlyFollowedByZeroOrOne(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		if (typeof matcher === 'function')
			this._matchers.push({ matchFunction: matcher, name, optional: true, greedy: false });
		else if (typeof matcher === 'string')
			this._matchers.push({ matchFunction: MatchEngine.matchString(matcher), name, optional: true, greedy: false });
		else if (matcher instanceof RegExp)
			this._matchers.push({ matchFunction: MatchEngine.matchRegex(matcher), name, optional: true, greedy: false });
		else
			throw new TypeError('Expected matcher to be a String, RegExp or Function');

		return this;
	}

	public followedByZeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		this._matchers.push({ matchFunction: MatchEngine.matchWhitespace(), name: null, optional: true, greedy: false });

		return this.directlyFollowedByZeroOrMore(matcher, name);
	}
	public directlyFollowedByZeroOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		if (typeof matcher === 'function')
			this._matchers.push({ matchFunction: matcher, name, optional: true, greedy: true });
		else if (typeof matcher === 'string')
			this._matchers.push({ matchFunction: MatchEngine.matchString(matcher), name, optional: true, greedy: true });
		else if (matcher instanceof RegExp)
			this._matchers.push({ matchFunction: MatchEngine.matchRegex(matcher), name, optional: true, greedy: true });
		else
			throw new TypeError('Expected matcher to be a String, RegExp or Function');

		return this;
	}

	public followedByOneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		this._matchers.push({ matchFunction: MatchEngine.matchWhitespace(), name: null, optional: true, greedy: false });

		return this.directlyFollowedByOneOrMore(matcher, name);
	}
	public directlyFollowedByOneOrMore(matcher: string | RegExp | MatchEngine.matchFunction, name: null | string = null): Rule {
		if (typeof matcher === 'function') {
			this._matchers.push({ matchFunction: matcher, name, optional: false, greedy: false });
			this._matchers.push({ matchFunction: matcher, name, optional: true, greedy: true });
		}
		else if (typeof matcher === 'string') {
			this._matchers.push({ matchFunction: MatchEngine.matchString(matcher), name, optional: false, greedy: false });
			this._matchers.push({ matchFunction: MatchEngine.matchString(matcher), name, optional: true, greedy: true });
		}
		else if (matcher instanceof RegExp) {
			this._matchers.push({ matchFunction: MatchEngine.matchRegex(matcher), name, optional: false, greedy: false });
			this._matchers.push({ matchFunction: MatchEngine.matchRegex(matcher), name, optional: true, greedy: true });
		}
		else
			throw new TypeError('Expected matcher to be a String, RegExp or Function');

		return this;
	}

	public transform(transformer: transformFunction): Rule {
		this._transformer = transformer;
		return this;
	}

	public throw(message: string): Rule {
		this._throwMessage = message;
		return this;
	}

	public recover(matcher: string | RegExp | MatchEngine.matchFunction): Rule {
		if (typeof matcher === 'function')
			this._recover = matcher;
		else if (typeof matcher === 'string')
			this._recover = MatchEngine.matchString(matcher);
		else if (matcher instanceof RegExp)
			this._recover = MatchEngine.matchRegex(matcher);
		else
			throw new TypeError('Expected matcher to be a String, RegExp or Function');

		return this;
	}

	private _recovery(result: Result.ERROR_Result, input: string, precedingNode: null | Node.Node, parserContext: Parser): Result.Result {
		if (this._recover === null)
			return result;
		else {
			for (let i: number = 0; i < input.length; i++) {
				const substring: string = input.substring(i);
				const result: Result.Result = this._recover(substring, null, parserContext);

				if (result.status === Result.STATUS.OK) {
					const raw = input.substring(0, i + result.node.raw.length);

					if (precedingNode === null)
						return Result.createOK(Node.TYPE.RECOVER, null, null, raw, result.rest);
					else
						return Result.calculateOK(precedingNode, Node.TYPE.RECOVER, null, null, raw, result.rest);
				}
			}

			return result;
		}
	}

	public execute(input: string, precedingNode: null | Node.Node, parserContext: Parser): Result.Result {
		let rest: string = input;
		const results: Array<Result.OK_Result> = [];
		const childNodes: { [key: string]: Node.Node | Node.Node[] } = {};
		let currentPrecedingNode: null | Node.Node = precedingNode;

		if (this._matchers.length === 0) {
			if (this._globalThrowMessage !== null)
				return Result.createERROR(Problem.TYPE.ERROR, this._globalThrowMessage);
			else
				throw new RangeError('Expected Rule to have at least one non-optional Matcher');
		}

		if (this._matchers.every(({ optional }) => optional)) {
			if (this._throwMessage !== null)
				return Result.createERROR(Problem.TYPE.ERROR, this._throwMessage);
			else
				throw new RangeError('Expected Rule to have at least one non-optional Matcher');
		}

		for (const { matchFunction, name, optional, greedy } of this._matchers) {
			let result: Result.Result = matchFunction(rest, currentPrecedingNode, parserContext);

			switch (result.status) {
				case Result.STATUS.OK: {
					if (name !== null)
						childNodes[name] = result.node;

					results.push(result);
					rest = result.rest;
					currentPrecedingNode = result.node;
					break;
				}
				case Result.STATUS.ERROR: {
					if (optional)
						continue;

					return this._recovery(result, input, precedingNode, parserContext);
				}
			}

			if (greedy) {
				while (result.status !== Result.STATUS.ERROR) {
					result = matchFunction(rest, currentPrecedingNode, parserContext);

					if (result.status === Result.STATUS.OK) {
						if (name !== null)
							if (!Array.isArray(childNodes[name]))
								childNodes[name] = [childNodes[name] as Node.Node, result.node];
							else
								(childNodes[name] as Node.Node[]).push(result.node);

						results.push(result);
						rest = result.rest;
						currentPrecedingNode = result.node;
					}
				}
			}

		}

		if (this._throwMessage !== null)
			return Result.createERROR(Problem.TYPE.ERROR, this._throwMessage);

		const raw: string = Result.calculateRaw(results[0], results[results.length - 1]);
		const meta: Meta.Meta = precedingNode === null ? Meta.create(raw) : Meta.calculate(precedingNode.meta, raw);
		const data: unknown | null = this._transformer === null ? null : this._transformer(childNodes, raw, meta);

		return precedingNode === null ?
			Result.createOK(Node.TYPE.MATCH, childNodes, data, raw, results[results.length - 1].rest) :
			Result.calculateOK(precedingNode, Node.TYPE.MATCH, childNodes, data, raw, results[results.length - 1].rest);
	}
}