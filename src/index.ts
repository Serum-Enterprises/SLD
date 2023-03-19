type JSON_T = null | boolean | number | string | Array<JSON_T> | { [key: string]: JSON_T };

function printCharTable(str: string) {
	console.table(str.split(/\n/)
		.map((line, index, lines) => {
			const lineWithEnding = line + (index !== lines.length - 1 ? '\n' : '');
			return lineWithEnding.split('');
		})
		.reduce((result, line, i) => {
			return {
				...result,
				[i]: line.reduce((result, char, j) => {
					return {
						...result,
						[j]: char
					};
				}, {})
			};
		}, {})
	);
}

namespace Meta {
	export interface Range {
		start: number,
		end: number
	}

	export interface Position {
		line: number,
		column: number
	}

	export interface Location {
		start: Position,
		end: Position,
		next: Position
	}

	export interface Meta {
		range: Range,
		location: Location
	}

	function splitSource(source: string): Array<string> {
		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		return source.split(/(\r\n|\r|\n)(?=.*)/g)
			.reduce((acc: Array<string>, value: string, index: number) => {
				if (index % 2 === 0)
					return [...acc, value];
				else {
					acc[acc.length - 1] = acc[acc.length - 1] + value;
					return acc;

				}
			}, [])
			.filter(value => value !== '');
	}

	function endsWithLineBreak(source: string): number {
		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		const match = source.match(/(\r\n|\r|\n)$/);
		return match ? match[0].length : 0;
	}

	export function create(source: string): Meta {
		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		const lines: Array<string> = splitSource(source);
		const lineBreakLength = endsWithLineBreak(lines[lines.length - 1]);

		return {
			range: {
				start: 0,
				end: source.length - 1
			},
			location: {
				start: {
					line: 1,
					column: 1
				},
				end: {
					line: lines.length,
					column: lines[lines.length - 1].length - lineBreakLength
				},
				next: {
					line: lines.length > 0 ? (lineBreakLength ? lines.length + 1 : lines.length) : 1,
					column: lines.length > 0 ? (lineBreakLength ? 1 : lines[lines.length - 1].length + 1) : 1
				}
			}
		};
	}

	export function calculate(precedingMeta: Meta, source: string): Meta {
		if (source.length === 0)
			throw new RangeError('Expected source to be a non-empty String');

		const lines = splitSource(source);
		const lineBreakLength = endsWithLineBreak(source);

		return {
			range: {
				start: precedingMeta.range.end + 1,
				end: precedingMeta.range.end + source.length
			},
			location: {
				start: {
					line: precedingMeta.location.next.line,
					column: precedingMeta.location.next.column
				},
				end: {
					line: precedingMeta.location.next.line + lines.length - 1,
					column: lines.length === 1 ? precedingMeta.location.next.column + source.length - 1 - lineBreakLength : lines[lines.length - 1].length - lineBreakLength
				},
				next: {
					line: lineBreakLength ?
						precedingMeta.location.next.line + lines.length :
						precedingMeta.location.next.line + lines.length - 1,
					column: lineBreakLength ? 1 : precedingMeta.location.next.column + lines[lines.length - 1].length - lineBreakLength
				}
			}
		};
	}

}

namespace Node {
	export enum TYPE {
		MATCH = 'MATCH',
		RECOVER = 'RECOVER'
	}

	export interface Node {
		type: TYPE,
		data: unknown,
		raw: string,
		meta: Meta.Meta
	}

	function cloneJSON(data: unknown): unknown {
		if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
			return data;
		if (Array.isArray(data))
			return data.reduce((result: Array<unknown>, item: unknown) => {
				return [...result, cloneJSON(item)];
			}, []);

		if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]')
			return Object.entries(data).reduce((result: { [key: string]: unknown }, [key, value]: [string, unknown]) => {
				return { ...result, [key]: cloneJSON(value) };
			}, {});

		throw new TypeError('Expected data to be valid JSON');
	}

	export function create(type: TYPE, data: unknown, raw: string) {
		if (raw.length === 0)
			throw new RangeError('Expected raw to be a non-empty String');

		return {
			type: type,
			data: cloneJSON(data),
			raw: raw,
			meta: Meta.create(raw)
		};
	}

	export function calculate(precedingNode: Node, type: TYPE, data: unknown, raw: string) {
		if (raw.length === 0)
			throw new RangeError('Expected raw to be a non-empty String');

		return {
			type: type,
			data: cloneJSON(data),
			raw: raw,
			meta: Meta.calculate(precedingNode.meta, raw)
		};
	}
}

namespace Result {
	export enum STATUS {
		OK = 'OK',
		ERROR = 'ERROR'
	}

	export interface OK_Result {
		status: STATUS.OK,
		node: Node.Node,
		rest: string
	}

	export interface ERROR_Result {
		status: STATUS.ERROR,
		node: null,
		rest: string
	}

	export type Result = OK_Result | ERROR_Result;

	export function createOK(type: Node.TYPE, data: unknown, raw: string, rest: string): OK_Result {
		return {
			status: STATUS.OK,
			node: Node.create(type, data, raw),
			rest: rest
		};
	}

	export function createERROR(rest: string): ERROR_Result {
		return {
			status: STATUS.ERROR,
			node: null,
			rest: rest
		};
	}

	export function calculateOK(precedingNode: Node.Node, type: Node.TYPE, data: unknown, raw: string, rest: string): OK_Result {
		return {
			status: STATUS.OK,
			node: Node.calculate(precedingNode, type, data, raw),
			rest: rest
		};
	}

	export function calculateERROR(rest: string): ERROR_Result {
		return {
			status: STATUS.ERROR,
			node: null,
			rest: rest
		};
	}

	export function calculateRaw(firstResult: OK_Result, lastResult: OK_Result): string {
		return firstResult.node.raw + firstResult.rest.slice(0, firstResult.rest.length - lastResult.rest.length);
	}
}

namespace Matcher {
	export type matchFunction = (input: string, precedingNode: null | Node.Node) => Result.Result;

	export function matchString(string: string): matchFunction {
		if (string.length === 0)
			throw new RangeError('Expected string to be a non-empty String');

		return (input: string, precedingNode: null | Node.Node): Result.Result => {
			if (!input.startsWith(string))
				return Result.createERROR(input);

			if (precedingNode === null)
				return Result.createOK(Node.TYPE.MATCH, string, string, input.slice(string.length));

			return Result.calculateOK(precedingNode, Node.TYPE.MATCH, string, string, input.slice(string.length));
		};
	}

	export function matchRegex(regex: RegExp): matchFunction {
		return (input: string, precedingNode: null | Node.Node): Result.Result => {
			const match = input.match(regex);

			if (match === null)
				return Result.createERROR(input);

			if (precedingNode === null)
				return Result.createOK(Node.TYPE.MATCH, match[0], match[0], input.slice(match[0].length));

			return Result.calculateOK(precedingNode, Node.TYPE.MATCH, match[0], match[0], input.slice(match[0].length));
		};
	}

	export function matchWhitespace(): matchFunction {
		return matchRegex(/^\s+/);
	}
}

class Rule {
	private _matchers: { matchFunction: Matcher.matchFunction, name: null | string, optional: boolean }[] = [];
	//private _handler: (nodes: { [key: string]: Node.Node }) => JSON_T | { [key: string]: Node.Node } = (nodes) => nodes;
	//private _recover: Function = () => null;

	private constructor() { }

	static begin(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
		return (new Rule()).directlyFollowedBy(matcher, name, optional);
	}

	followedBy(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
		if (typeof matcher === 'function') {
			this._matchers.push({ matchFunction: Matcher.matchWhitespace(), name: null, optional: true });
			this._matchers.push({ matchFunction: matcher, name, optional });
		}
		else if (typeof matcher === 'string') {
			this._matchers.push({ matchFunction: Matcher.matchWhitespace(), name: null, optional: true });
			this._matchers.push({ matchFunction: Matcher.matchString(matcher), name, optional });
		}
		else if (matcher instanceof RegExp) {
			this._matchers.push({ matchFunction: Matcher.matchWhitespace(), name: null, optional: true });
			this._matchers.push({ matchFunction: Matcher.matchRegex(matcher), name, optional });
		}
		else
			throw new TypeError('Expected matcher to be a String, RegExp or matchFunction');

		return this;
	}

	directlyFollowedBy(matcher: string | RegExp | Matcher.matchFunction, name: null | string = null, optional: boolean = false): Rule {
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

	execute(input: string, precedingNode: null | Node.Node): Result.Result {
		let rest: string = input;
		let firstResult: null | Result.OK_Result = null;
		let lastResult: null | Result.OK_Result = null;
		const namedNodes: { [key: string]: Node.Node } = {};
		let currentPrecedingNode: null | Node.Node = precedingNode;

		for (const { matchFunction, name, optional } of this._matchers) {
			const result = matchFunction(rest, currentPrecedingNode);

			if (result.status !== Result.STATUS.OK) {
				if (optional)
					continue;
				else
					return Result.createERROR(input);
			}

			if (name !== null)
				namedNodes[name] = result.node;

			if (firstResult === null)
				firstResult = result;

			lastResult = result;
			rest = result.rest;
			currentPrecedingNode = result.node;
		}

		if (firstResult === null)
			return Result.createERROR(input);

		if (lastResult === null)
			return Result.createERROR(input);

		if (precedingNode === null)
			return Result.createOK(Node.TYPE.MATCH, namedNodes, Result.calculateRaw(firstResult, lastResult), lastResult.rest);
		else
			return Result.calculateOK(precedingNode, Node.TYPE.MATCH, namedNodes, Result.calculateRaw(firstResult, lastResult), lastResult.rest);
	}
}

class RuleVariant extends Array<Rule> {
	constructor(...rules: Array<Rule>) {
		super(...rules);
	}

	static create(ruleArray: Array<Rule>): RuleVariant {
		return new RuleVariant(...ruleArray);
	}

	execute(input: string, precedingNode: null | Node.Node): Result.Result {
		for (const rule of this) {
			const result = rule.execute(input, precedingNode);

			if (result.status === Result.STATUS.OK)
				return result;
		}

		return Result.createERROR(input);
	}
}

class Parser extends Map<string, RuleVariant> {
	private _rootVariant: RuleVariant;

	constructor(rootVariant: RuleVariant, ...ruleVariants: Array<[string, RuleVariant]>) {
		super(ruleVariants);
		this._rootVariant = rootVariant;
	}

	static create(rootVariant: RuleVariant, ...ruleVariants: Array<[string, RuleVariant]>): Parser {
		return new Parser(rootVariant, ...ruleVariants);
	}

	parse(input: string, optionalMeta: boolean = false): Result.Result {
		let result: Result.Result;

		if (optionalMeta)
			result = JSON.parse(JSON.stringify(this._rootVariant.execute(input, null)), (key: string, value: any) => key === 'meta' ? undefined : value);
		else
			result = this._rootVariant.execute(input, null);

		return result;
	}
}

export { Rule, RuleVariant, Parser };