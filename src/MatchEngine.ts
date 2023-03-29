import * as Node from './lib/Node';
import * as Problem from './lib/Problem';
import * as Result from './lib/Result';
import * as Parser from './Parser';

export type matchFunction = (input: string, precedingNode: null | Node.Node, parserContext: Parser.Parser) => Result.Result;

export function matchString(string: string): matchFunction {
	if (string.length === 0)
		throw new RangeError('Expected string to be a non-empty String');

	return (input: string, precedingNode: null | Node.Node): Result.Result => {
		if (!input.startsWith(string))
			return Result.createERROR(Problem.TYPE.MISMATCH, `Expected ${string}`);

		if (precedingNode === null)
			return Result.createOK(Node.TYPE.MATCH, null, null, string, input.slice(string.length));

		return Result.calculateOK(precedingNode, Node.TYPE.MATCH, null, null, string, input.slice(string.length));
	};
}

export function matchRegex(regex: RegExp): matchFunction {
	return (input: string, precedingNode: null | Node.Node): Result.Result => {
		const match = input.match(regex);

		if (match === null)
			return Result.createERROR(Problem.TYPE.MISMATCH, `Expected ${regex}`);

		if (precedingNode === null)
			return Result.createOK(Node.TYPE.MATCH, null, null, match[0], input.slice(match[0].length));

		return Result.calculateOK(precedingNode, Node.TYPE.MATCH, null, null, match[0], input.slice(match[0].length));
	};
}

export function matchVariant(name: string): matchFunction {
	if (name.length === 0)
		throw new RangeError('Expected name to be a non-empty String');

	return (input: string, precedingNode: null | Node.Node, parserContext: Parser.Parser): Result.Result => {
		if (!parserContext.has(name))
			throw new ReferenceError(`Expected Parser to have a rule named ${name}`);

		const ruleVariant = parserContext.get(name);

		if (ruleVariant === undefined)
			throw new ReferenceError(`Expected Parser to have a rule named ${name}`);

		const result = ruleVariant.execute(input, precedingNode, parserContext);

		if (result.status === Result.STATUS.ERROR)
			return result;

		if (precedingNode === null)
			return Result.createOK(Node.TYPE.MATCH, result.node.childNodes, result.node.data, result.node.raw, result.rest);

		return Result.calculateOK(precedingNode, Node.TYPE.MATCH, result.node.childNodes, result.node.data, result.node.raw, result.rest);
	}
}

export function matchWhitespace(): matchFunction {
	return matchRegex(/^\s+/);
}