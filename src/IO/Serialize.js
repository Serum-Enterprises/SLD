const Component = require('../src/Component');
const Rule = require('../src/Rule');
const Variant = require('../src/Variant');
const Parser = require('../src/Parser');

class Serialize {
	static component(component) {
		if (!(component instanceof Component))
			throw new TypeError('Expected component to be an instance of Component');

		return {
			type: component.type,
			value: component.value,
			name: component.name,
			optional: component.optional,
			greedy: component.greedy
		};
	}

	static rule(rule) {
		if (!(rule instanceof Rule))
			throw new TypeError('Expected rule to be an instance of Rule');

		return {
			components: rule.components.map(component => Serialize.component(component)),
			autoThrow: rule.autoThrow,
			autoRecover: rule.autoRecover ? Serialize.component(rule.autoRecover) : null
		};
	}

	static variant(variant) {
		if (!(variant instanceof Variant))
			throw new TypeError('Expected variant to be an instance of Variant');

		return {
			rules: variant.rules.map(rule => Serialize.rule(rule))
		};
	}

	static parser(parser) {
		if (!(parser instanceof Parser))
			throw new TypeError('Expected parser to be an instance of Parser');

		return {
			variants: parser.variants.map(variant => Serialize.Variant(variant))
		};
	}
}

module.exports = Serialize;