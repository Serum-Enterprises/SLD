import * as Rule from './Rule';
import * as Parser from './Parser';

import * as Node from '../lib/Node';
import { VariantError } from '../lib/errors/VariantError';

export interface VariantInterface {
	rules: Rule.RuleInterface[];
}

export class Variant {
	private _rules: Rule.Rule[];

	public constructor(rules: Rule.Rule[]) {
		this._rules = rules;
	}

	public get rules() {
		return this._rules;
	}

	public execute(input: string, precedingNode: Node.Node | null, parentParser: Parser.Parser): Node.Node {
		for (const rule of this._rules) {
			try {
				return rule.execute(input, precedingNode, parentParser);
			}
			catch(error) {}
		}

		throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
	}

	public toJSON(): VariantInterface {
		return {
			rules: this._rules.map(rule => rule.toJSON())
		};
	}

	public static verifyInterface(data: any, varName: string = 'data'): VariantInterface {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if (!Array.isArray(data.rules))
			throw new TypeError(`Expected ${varName}.rules to be an Array`);

		data.rules.forEach((rule: any, index: number) => Rule.Rule.verifyInterface(rule, `${varName}.rule[${index}]`));

		return data as VariantInterface;
	}

	public static fromJSON(data: VariantInterface): Variant {
		return new Variant(
			data.rules.map((rule: Rule.RuleInterface) => Rule.Rule.fromJSON(rule))
		);
	}
}