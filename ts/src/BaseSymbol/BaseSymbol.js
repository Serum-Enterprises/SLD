const { Result } = require('../Util/Result/Result');
const { Option } = require('../Util/Option/Option');
const { Node } = require('../Util/Node/Node');

const MisMatchError = require('../Util/Error/MisMatchError/MismatchError');

class BaseSymbol {
	#type;
	#value;
	#name;

	constructor(type, value, name) {
		this.#type = type;
		this.#value = value;
		this.#name = name;
	}

	get type() {
		return this.#type;
	}

	get value() {
		return this.#value;
	}

	get name() {
		return this.#name;
	}

	find(source, precedingNode, grammarContext) {
		let rest = source;
		let result = Option.None();

		while (result.isNone() && rest.length > 0) {
			const parseResult = this.parse(rest, precedingNode, grammarContext);

			result = parseResult.OkToOption();
			rest = rest.slice(1);
		}

		return result.mapSome(
			result => precedingNode.match(
				node => Node.createFollowerWith(node, result.raw, Option.None()),
				() => Node.create(result.raw, Option.Some())
			)
		);
	}

	parse(source, precedingNode, grammarContext) {
		switch (this.#type) {
			case 'STRING': {
				if (!source.startsWith(this.#value))
					return Result.Err(new MisMatchError(precedingNode.match(node => node.range[1] + 1, () => 0), `Expected ${this.#value}`));

				return Result.Some(precedingNode.match(
					node => Node.createFollowerWith(node, this.#value, Result.Some({})),
					() => Node.create(this.#value, Result.Some({}))
				));
			}
			case 'REGEXP': {
				const match = source.match(value.source.startsWith('^') ? value : new RegExp(`^${value.source}`, value.flags));

				if (!match)
					return Result.Err(new MisMatchError(precedingNode.match(node => node.range[1] + 1, () => 0), `Expected /^${this.#value}/`));

				if (match[0].length === 0)
					return Result.Err(new EmptyStringError());

				return Result.Some(precedingNode.match(
					node => Node.createFollowerWith(node, match[0], Result.Some({})),
					() => Node.create(match[0], Result.Some({}))
				));
			}
			case 'RULESET': {
				return grammarContext.ruleSets[this.#value].parse(source, precedingNode, grammarContext);
			}
		}
	}
}

module.exports = { BaseSymbol };