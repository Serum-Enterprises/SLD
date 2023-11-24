import { VariantInterface } from '../../Interfaces';
import { Rule } from './Rule';

export class Variant {
	private _rules: Rule[];

	public static create(rules: Rule[] = []) {
		return new Variant(rules);
	}

	public constructor(rules: Rule[] = []) {
		this._rules = rules;
	}

	public addRule(rule: Rule): Variant {
		this._rules.push(rule);

		return this;
	}

	public toJSON(): VariantInterface {
		return this._rules.map(rule => rule.toJSON());
	}
}