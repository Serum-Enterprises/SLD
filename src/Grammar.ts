import { Variant, VariantInterface } from "./Variant";
import { Node } from "./lib/Node";

export interface ParserInterface {
	[key: string]: VariantInterface;
}

export class Grammar {
	public variants: Map<string, Variant>;

	public static fromJSON(json: ParserInterface): Grammar {
		return new Grammar(
			Object.entries(json)
				.reduce((result, [key, value]) => {
					return { ...result, [key]: Variant.fromJSON(value) };
				}, {})
		);
	}

	public constructor(variants: { [key: string]: Variant } = {}) {
		this.variants = new Map(Object.entries(variants));
	}

	private verifyVariants() {
		Array.from(this.variants.entries()).forEach(([, value], _, entries) => {
			value.rules.forEach((rule) => {
				rule.components.forEach(component => {
					if (component.type === 'VARIANT' && !entries.find(([key]) => key === component.value))
						throw new ReferenceError(`Variant ${component.value} not found`);
				})
			})
		});
	}

	public parse(source: string, rootVariant: string): Node {
		if (!this.variants.has(rootVariant))
			throw new ReferenceError(`Expected rootVariant to be an existing Variant`);

		this.verifyVariants();

		return this.variants.get(rootVariant)!.parse(source, null, this);
	}

	public toJSON(): ParserInterface {
		return Array.from(this.variants.entries())
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