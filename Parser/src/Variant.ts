import { VariantInterface } from '../../Interfaces';
import type { Grammar } from './Grammar';
import { Rule } from './Rule';

import { Node } from '../lib/Node';
import { MisMatchError } from '../lib/errors/MisMatchError';
import { VariantError } from '../lib/errors/VariantError';

export class Variant {
	private _rules: Rule[];

	public static fromJSON(json: VariantInterface): Variant {
		return new Variant(json.map(rule => Rule.fromJSON(rule)));
	}

	private constructor(rules: Rule[]) {
		this._rules = rules;
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		for (let i = 0; i < this._rules.length; i++) {
			try {
				return this._rules[i].parse(source, precedingNode, grammarContext);
			}
			catch (error) {
				if (!(error instanceof MisMatchError))
					throw error;
			}
		}

		throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
	}
}