import { Variant, VariantInterface } from "./Variant";
import { Node } from "./lib/Node";

export interface ParserInterface {
	[key: string]: VariantInterface;
}

export class Grammar {
	private _variants: Map<string, Variant>;

	public static fromJSON(json: ParserInterface): Grammar {
		return new Grammar(
			Object.entries(json)
				.reduce((result, [key, value]) => {
					return { ...result, [key]: Variant.fromJSON(value) };
				}, {})
		);
	}

	public constructor(variants: { [key: string]: Variant } = {}) {
		this._variants = new Map(Object.entries(variants));
	}

	public getVariant(name: string): Variant | null {
		return this._variants.get(name) || null;
	}

	public setVariant(name: string, variant: Variant): Grammar {
		this._variants.set(name, variant);

		return this;
	}

	public hasVariant(name: string): boolean {
		return this._variants.has(name);
	}

	public deleteVariant(name: string): boolean {
		return this._variants.delete(name);
	}

	public parse(source: string, rootVariant: string): Node {
		if(!this._variants.has(rootVariant))
			throw new ReferenceError(`Expected rootVariant to be an existing Variant`);

		return this._variants.get(rootVariant)!.parse(source, null, this);
	}

	public toJSON(): ParserInterface {
		return Array.from(this._variants.entries())
			.reduce((result, [key, value]) => {
				return { ...result, [key]: value.toJSON() };
			}, {});
	}
}

export class GrammarBuilder extends Grammar {
	public static create(variants: { [key: string]: Variant } = {}) {
		return new GrammarBuilder(variants);
	}
}