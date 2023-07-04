const { Component } = require('../src/Component');
const { Rule } = require('../src/Rule');
const { Variant } = require('../src/Variant');
const { Parser } = require('../src/Parser');

class Deserialize {
	static #component(data) {
		return new Component(
			data.type.toUpperCase(),
			data.value,
			data.name,
			data.optional,
			data.greedy
		);
	}

	static component(component) {
		const verifiedData = Component.verifyInterface(component, 'component');

		return Deserialize.#component(verifiedData);
	}

	static #rule(data) {
		return new Rule(
			data.components.map((component) => Deserialize.#component(component)),
			data.autoThrow,
			data.autoRecover ? Deserialize.#component(data.autoRecover) : null
		);
	}

	static rule(rule) {
		const verifiedData = Rule.verifyInterface(rule, 'rule');

		return Deserialize.#rule(verifiedData);
	}

	static #variant(data) {
		return new Variant(data.rules.map((rule) => Deserialize.#rule(rule)));
	}

	static variant(variant) {
		const verifiedData = Variant.verifyInterface(variant, 'variant');

		return Deserialize.#variant(verifiedData);
	}

	static #parser(data) {
		return new Parser(
			Deserialize.#variant(data.rootVariant),
			Object.entries(data.variants).reduce((result, [key, value]) => {
				return result.set(key, Deserialize.#variant(value));
			}, new Map())
		);
	}

	static parser(parser) {
		const verifiedData = Parser.verifyInterface(parser, 'parser');

		const variantNames = new Set(Object.keys(verifiedData.variants));

		// Walk through all Variants
		for (const [name, variant] of Object.entries(verifiedData.variants)) {
			// Verify that the Variant is not empty
			if (variant.rules.length === 0)
				throw new RangeError(`Expected Variant ${name} to have at least one Rule`);

			// Verify that all Rules have at least one Component or an autoThrow
			for (const [index, rule] of variant.rules.entries())
				if (rule.components.length === 0 && !rule.autoThrow)
					throw new RangeError(`Expected Rule ${index} of Variant ${name} to have at least one Component or autoThrow set`);

			// Verify that all calls to other Variants are valid
			for (const [ruleIndex, rule] of variant.rules.entries())
				for (const [componentIndex, component] of rule.components.entries())
					if (component.type.toUpperCase() === 'VARIANT' && !variantNames.has(component.value))
						throw new ReferenceError(`Expected Variant ${name} with Rule ${ruleIndex} in Component ${componentIndex} to reference an existing Variant`);

			// Verify that autoRecover Components are not optional and not greedy
			for (const [ruleIndex, rule] of variant.rules.entries())
				if (rule.autoRecover && (rule.autoRecover.optional === true || rule.autoRecover.greedy === true))
					throw new RangeError(`Expected Variant ${name} with Rule ${ruleIndex} to not have an optional and/or greedy autoRecover`);
		}

		return Deserialize.#parser(verifiedData);
	}
}

module.exports = Deserialize;