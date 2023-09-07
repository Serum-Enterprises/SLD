import { RuleInterface } from '../Builder';
import type { Grammar } from './Grammar';
import { Rule } from './Rule';

import { Node } from './lib/Node';
import { CustomError } from './lib/errors/CustomError';
import { MisMatchError } from './lib/errors/MisMatchError';
import { VariantError } from './lib/errors/VariantError';

export type VariantInterface = RuleInterface[];

export class Variant {
	private _rules: Rule[];

	public static fromJSON(json: VariantInterface): Variant {
		return new Variant(json.map(rule => Rule.fromJSON(rule)));
	}

	private constructor(rules: Rule[]) {
		this._rules = rules;
	}

	/**
	 * Begin Parsing Rules.
	 * If a Rule fails due to a MisMatchError, try the next Rule.
	 * If a Rule fails due to a CustomError, throw the CustomError.
	 * If no Rule matches, throw a VariantError, indicating that there was no valid Path through this Variant.
	 */
	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		for (let i = 0; i < this._rules.length; i++) {
			try {
				return this._rules[i].parse(source, precedingNode, grammarContext);
			}
			catch (error) {
				if (error instanceof CustomError)
					throw error;

				if (!(error instanceof MisMatchError))
					throw error;
			}
		}

		throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
	}
}