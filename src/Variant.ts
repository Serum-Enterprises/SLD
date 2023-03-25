import * as Node from '../lib/Node';
import * as Problem from '../lib/Problem';
import * as Result from '../lib/Result';
import { Rule } from './Rule';
import * as Parser from './Parser';

export class Variant extends Array<Rule> {
	public constructor(...rules: Array<Rule>) {
		if (rules.length === 0)
			throw new RangeError('Expected RuleVariant to have at least one Rule');

		super(...rules);
	}

	public static create(ruleArray: Array<Rule>): Variant {
		return new Variant(...ruleArray);
	}

	public execute(input: string, precedingNode: null | Node.Node, parserContext: Parser.Parser): Result.Result {
		for (const rule of this) {
			const result = rule.execute(input, precedingNode, parserContext);

			if (result.status === Result.STATUS.OK)
				return result;

			if (result.status === Result.STATUS.ERROR && result.problem.type === Problem.TYPE.ERROR)
				return result;
		}

		return Result.createERROR(Problem.TYPE.ERROR, 'No Rule matched');
	}
}