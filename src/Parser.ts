import * as Variant from './Variant';

export interface ParserInterface {
	rootVariant: Variant.VariantInterface;
	variants: {[key: string]: Variant.VariantInterface};
}

export class Parser {
	private readonly _rootVariant: Variant.Variant;
	private readonly _variants: Map<string, Variant.Variant>;

	public constructor(rootVariant: Variant.Variant, variants: Map<string, Variant.Variant>) {
		this._rootVariant = rootVariant;
		this._variants = variants;
	}

	public get rootVariant() {
		return this._rootVariant;
	}

	public get variants() {
		return this._variants;
	}

	public execute(input: string) {
		return this._rootVariant.execute(input, null, this);
	}

	public toJSON(): ParserInterface {
		return {
			rootVariant: this._rootVariant.toJSON(),
			variants: Array.from(this._variants.entries()).reduce((result, [key, value]) => {
				return {...result, [key]: value.toJSON()}
			}, {})
		}
	}

	public static verifyInterface(data: any, varName: string = 'data'): ParserInterface {
		if (Object.prototype.toString.call(data) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		Variant.Variant.verifyInterface(data.rootVariant, `${varName}.rootVariant`);

		if(Object.prototype.toString.call(data.variants) !== '[object Object]')
			throw new TypeError(`Expected ${varName}.variants to be an Object`);

		Object.entries(data.variants).forEach(([key, value]) => Variant.Variant.verifyInterface(value, `${varName}.variants[${key}]`));

		return data as ParserInterface;
	}

	public static fromJSON(data: ParserInterface): Parser {
		return new Parser(
			Variant.Variant.fromJSON(data.rootVariant),
			Object.entries(data.variants).reduce((result, [key, value]) => {
				return result.set(key, Variant.Variant.fromJSON(value));
			}, new Map())
		);
	}

	public serialize(): string {
		return JSON.stringify(this.toJSON());
	}

	public static deserialize(data: string): Parser {
		const parsedData: any = JSON.parse(data);
		const verifiedData: ParserInterface = Parser.verifyInterface(parsedData);

		const variantNames: Set<string> = new Set(Object.keys(verifiedData.variants));

		// Walk through all Variants
		for(const [name, variant] of Object.entries(verifiedData.variants)) {
			// Verify that the Variant is not empty
			if(variant.rules.length === 0)
				throw new RangeError(`Expected Variant ${name} to have at least one Rule`);

			// Verify that all Rules have at least one Component or an autoThrow
			for(const [index, rule] of variant.rules.entries())
				if(rule.components.length === 0 && !rule.autoThrow)
					throw new RangeError(`Expected Rule ${index} of Variant ${name} to have at least one Component or autoThrow set`);

			// Verify that all calls to other Variants are valid
			for(const [ruleIndex, rule] of variant.rules.entries())
				for(const [componentIndex, component] of rule.components.entries())
					if(component.type.toUpperCase() === 'VARIANT' && !variantNames.has(component.value))
						throw new ReferenceError(`Expected Variant ${name} with Rule ${ruleIndex} in Component ${componentIndex} to reference an existing Variant`);

			// Verify that autoRecover Components are not optional and not greedy
			for(const [ruleIndex, rule] of variant.rules.entries())
				if(rule.autoRecover && (rule.autoRecover.optional === true || rule.autoRecover.greedy === true))
					throw new RangeError(`Expected Variant ${name} with Rule ${ruleIndex} to not have an optional and/or greedy autoRecover`);
		}
		
		return Parser.fromJSON(verifiedData);
	}
}