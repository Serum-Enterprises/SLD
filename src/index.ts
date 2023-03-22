import * as Meta from '../lib/Meta';
import * as Node from '../lib/Node';
import * as Result from '../lib/Result';
import * as Problem from '../lib/Problem';

export namespace Matcher {
	export type matchFunction = (input: string, precedingNode: null | Node.Node) => Result.Result;

	export function matchString(string: string): matchFunction {
		if (string.length === 0)
			throw new RangeError('Expected string to be a non-empty String');

		return (input: string, precedingNode: null | Node.Node): Result.Result => {
			if (!input.startsWith(string))
				return Result.createERROR(Problem.TYPE.MISMATCH, `Expected ${string}`);

			if (precedingNode === null)
				return Result.createOK(Node.TYPE.MATCH, string, string, input.slice(string.length));

			return Result.calculateOK(precedingNode, Node.TYPE.MATCH, string, string, input.slice(string.length));
		};
	}

	export function matchRegex(regex: RegExp): matchFunction {
		return (input: string, precedingNode: null | Node.Node): Result.Result => {
			const match = input.match(regex);

			if (match === null)
				return Result.createERROR(Problem.TYPE.MISMATCH, `Expected ${regex}`);

			if (precedingNode === null)
				return Result.createOK(Node.TYPE.MATCH, match[0], match[0], input.slice(match[0].length));

			return Result.calculateOK(precedingNode, Node.TYPE.MATCH, match[0], match[0], input.slice(match[0].length));
		};
	}

	export function matchWhitespace(): matchFunction {
		return matchRegex(/^\s+/);
	}
}

export type transformFunction = (nodes: { [key: string]: Node.Node }, raw: string, meta: Meta.Meta) => unknown;

export class Rule {
	private _matchers: { matchFunction: Matcher.matchFunction, name: null | string, optional: boolean }[];
	private _transformer: transformFunction;
	private _throwMessage: null | string;
	//private _recover: Function = () => null;

	private constructor() {
		this._matchers = [];
		this._transformer = nodes => nodes;
		this._throwMessage = null;
	}

	public static begin(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
		return (new Rule()).directlyFollowedBy(matcher, name, optional);
	}

	public followedBy(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
		this._matchers.push({ matchFunction: Matcher.matchWhitespace(), name: null, optional: true });

		if (typeof matcher === 'function')
			this._matchers.push({ matchFunction: matcher, name, optional });
		else if (typeof matcher === 'string')
			this._matchers.push({ matchFunction: Matcher.matchString(matcher), name, optional });
		else if (matcher instanceof RegExp)
			this._matchers.push({ matchFunction: Matcher.matchRegex(matcher), name, optional });
		else
			throw new TypeError('Expected matcher to be a String, RegExp or matchFunction');

		return this;
	}

	public directlyFollowedBy(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
		if (typeof matcher === 'function') {
			this._matchers.push({ matchFunction: matcher, name, optional });
		}
		else if (typeof matcher === 'string') {
			this._matchers.push({ matchFunction: Matcher.matchString(matcher), name, optional });
		}
		else if (matcher instanceof RegExp) {
			this._matchers.push({ matchFunction: Matcher.matchRegex(matcher), name, optional });
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

	public execute(input: string, precedingNode: null | Node.Node): Result.Result {
		let rest: string = input;
		const results: Array<Result.OK_Result> = [];
		const namedNodes: { [key: string]: Node.Node } = {};
		let currentPrecedingNode: null | Node.Node = precedingNode;

		// Throw an Error if there are no Matchers
		if (this._matchers.length === 0 || this._matchers.every(({ optional }) => optional))
			throw new RangeError('Expected Rule to have at least one non-optional Matcher');

		for (const { matchFunction, name, optional } of this._matchers) {
			const result: Result.Result = matchFunction(rest, currentPrecedingNode);

			switch (result.status) {
				case Result.STATUS.OK: {
					if (name !== null)
						namedNodes[name] = result.node;

					results.push(result);
					rest = result.rest;
					currentPrecedingNode = result.node;
					break;
				}
				case Result.STATUS.ERROR: {
					if (optional)
						continue;
					else
						return result;
				}
			}
		}

		if (this._throwMessage !== null)
			return Result.createERROR(Problem.TYPE.ERROR, this._throwMessage);

		const raw = Result.calculateRaw(results[0], results[results.length - 1]);
		const meta = precedingNode === null ? Meta.create(raw) : Meta.calculate(precedingNode.meta, raw);
		const data = this._transformer(namedNodes, raw, meta);

		return precedingNode === null ?
			Result.createOK(Node.TYPE.MATCH, data, raw, results[results.length - 1].rest) :
			Result.calculateOK(precedingNode, Node.TYPE.MATCH, data, raw, results[results.length - 1].rest);
	}
}

export class RuleVariant extends Array<Rule> {
	public constructor(...rules: Array<Rule>) {
		if (rules.length === 0)
			throw new RangeError('Expected RuleVariant to have at least one Rule');

		super(...rules);
	}

	public static create(ruleArray: Array<Rule>): RuleVariant {
		return new RuleVariant(...ruleArray);
	}

	public execute(input: string, precedingNode: null | Node.Node): Result.Result {
		for (const rule of this) {
			const result = rule.execute(input, precedingNode);

			if (result.status === Result.STATUS.OK)
				return result;
		}

		return Result.createERROR(Problem.TYPE.ERROR, 'No Rule matched');
	}
}

export class Parser extends Map<string, RuleVariant> {
	private _rootVariant: RuleVariant;

	public constructor(rootVariant: RuleVariant, ...ruleVariants: Array<[string, RuleVariant]>) {
		super(ruleVariants);
		this._rootVariant = rootVariant;
	}

	public static create(rootVariant: RuleVariant, ...ruleVariants: Array<[string, RuleVariant]>): Parser {
		return new Parser(rootVariant, ...ruleVariants);
	}

	public parse(input: string, optionalMeta: boolean = false): Result.Result {
		let result: Result.Result;

		if (optionalMeta)
			result = JSON.parse(JSON.stringify(this._rootVariant.execute(input, null)), (key: string, value: any) => key === 'meta' ? undefined : value);
		else
			result = this._rootVariant.execute(input, null);

		return result;
	}
}