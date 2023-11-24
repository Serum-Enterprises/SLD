import { GrammarInterface } from "../../Interfaces";
import { Variant } from "./Variant";
import { Node } from "../lib/Node";
import { MisMatchError } from "../lib/errors/MisMatchError";

export class Grammar {
	private _variants: Map<string, Variant>;

	public static fromJSON(grammar: GrammarInterface): Grammar {
		const grammarEntries = Object.entries(grammar);

		// Verify all Variants in the Grammar exist
		grammarEntries.forEach(([, variant]) => {
			variant.forEach(rule => {
				rule.components.forEach(componentSet => {
					componentSet.components.forEach(component => {
						if (component.type === 'VARIANT' && !grammarEntries.find(([name]) => name === component.value))
							throw new ReferenceError(`Expected Variant ${component.value} to exist`);
					});
				});
			});
		});

		// TODO: Resolve Left Recurison

		// Build the Grammar
		return new Grammar(
			Object.entries(grammar)
				.reduce((result: Map<string, Variant>, [key, value]) => {
					return result.set(key, Variant.fromJSON(value));
				}, new Map())
		);
	}

	private constructor(variants: Map<string, Variant>) {
		this._variants = variants;
	}

	public parse(source: string, rootVariant: string, failOnRest: boolean = true, precedingNode: Node | null = null): Node {
		if (!this._variants.has(rootVariant))
			throw new ReferenceError(`Expected rootVariant to be an existing Variant`);

		const result = this._variants.get(rootVariant)!.parse(source, precedingNode, this);

		if (failOnRest && result.raw !== source)
			throw new MisMatchError('Expected End of File', result.range[1] + 1);

		return result;
	}
}