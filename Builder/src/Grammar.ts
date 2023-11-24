import { GrammarInterface } from '../../Interfaces/Grammar';
import { Variant } from './Variant';

export class Grammar {
	private _variants: Map<string, Variant>;

	public static create(variants: { [key: string]: Variant } = {}) {
		return new Grammar(variants);
	}

	public constructor(variants: { [key: string]: Variant } = {}) {
		this._variants = new Map(Object.entries(variants));
	}

	addVariant(name: string, variant: Variant): Grammar {
		this._variants.set(name, variant);

		return this;
	}

	public toJSON(): GrammarInterface {
		return Array.from(this._variants.entries())
			.reduce((result, [key, value]) => {
				return { ...result, [key]: value.toJSON() };
			}, {});
	}
}