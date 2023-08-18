import { Rule, RuleInterface } from './Rule';
import { Node } from './lib/Node';
import type { Grammar } from './Grammar';
import { CustomThrowError } from './lib/errors/CustomThrowError';
import { MisMatchError } from './lib/errors/MisMatchError';
import { VariantError } from './lib/errors/VariantError';
import { RecursionError } from './lib/errors/RecursionError';

export type VariantInterface = RuleInterface[];

export class Variant {
	private static _stack: Map<Symbol, Set<number>> = new Map();
	private _id: Symbol;
	private _rules: Rule[];

	public static fromJSON(json: VariantInterface): Variant {
		return new Variant(json.map(rule => Rule.fromJSON(rule)));
	}

	public constructor(rules: Rule[]) {
		this._id = Symbol();
		this._rules = rules;
	}

	public addRule(rule: Rule): Variant {
		this._rules.push(rule);

		return this;
	}

	public parse(source: string, precedingNode: Node | null, grammarContext: Grammar) {
		if (!Variant._stack.has(this._id))
			Variant._stack.set(this._id, new Set());

		if (Variant._stack.get(this._id)!.has(source.length))
			throw new RecursionError('Recursion detected');
		else
			Variant._stack.get(this._id)!.add(source.length);

		for (let rule of this._rules) {
			try {
				const result = rule.parse(source, precedingNode, grammarContext);

				return result;
			}
			catch (error) {
				if (error instanceof CustomThrowError)
					throw error;

				if (!(error instanceof MisMatchError) && !(error instanceof CustomThrowError))
					throw error;
			}
		}

		throw new VariantError('No Rule matched', precedingNode ? precedingNode.range[1] + 1 : 0);
	}

	public toJSON(): VariantInterface {
		return this._rules.map(rule => rule.toJSON());
	}
}

export class VariantBuilder extends Variant {
	public static create(rules: Rule[]) {
		return new VariantBuilder(rules);
	}
}