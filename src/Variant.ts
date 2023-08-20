import { Rule, RuleInterface } from './Rule';
import { Node } from './lib/Node';
import type { Grammar } from './Grammar';
import { CustomThrowError } from './lib/errors/CustomThrowError';
import { MisMatchError } from './lib/errors/MisMatchError';
import { VariantError } from './lib/errors/VariantError';
import { RecursionError } from './lib/errors/RecursionError';

export type VariantInterface = RuleInterface[];

export class Variant {
	/**
	 * The Stack is a Map of Variant Identifiers and Call-Maps
	 * The Call-Maps are a Map of source String Lengths and call counts
	 * 
	 * It is logging what Variant was called with what source String how many times.
	 */
	private static _stack: Map<Symbol, Map<number, number>> = new Map();
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
		if(!Variant._stack.has(this._id))
			Variant._stack.set(this._id, new Map());

		if (!Variant._stack.get(this._id)!.has(source.length))
			Variant._stack.get(this._id)!.set(source.length, 1);
		else
			Variant._stack.get(this._id)!.set(source.length, Variant._stack.get(this._id)!.get(source.length)! + 1);

		let i = Variant._stack.get(this._id)!.get(source.length)! - 1;

		for (; i < this._rules.length; i++) {
			try {
				const result = this._rules[i].parse(source, precedingNode, grammarContext);

				Variant._stack.get(this._id)!.set(source.length, Variant._stack.get(this._id)!.get(source.length)! - 1);

				return result;
			}
			catch (error) {
				if (error instanceof CustomThrowError) {
					Variant._stack.get(this._id)!.delete(source.length);
					throw error;
				}

				if (!(error instanceof MisMatchError)) {
					Variant._stack.get(this._id)!.delete(source.length);
					throw error;
				}
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