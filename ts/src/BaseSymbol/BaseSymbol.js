const { Result, Option, Node } = require('../Util');

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
					return Result.Err({
						message: `Expected ${this.#value}`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});

				return Result.Some(precedingNode.match(
					node => Node.createFollowerWith(node, this.#value, Result.Some({})),
					() => Node.create(this.#value, Result.Some({}))
				));
			}
			case 'REGEXP': {
				const match = source.match(this.#value.source.startsWith('^') ? value : new RegExp(`^${this.#value.source}`, this.#value.flags));

				if (!match)
					return Result.Err({
						message: `Expected ${this.#value}`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});

				if (match[0].length === 0)
					return Result.Err({
						message: `Empty Match`,
						location: precedingNode.match(node => node.range[1] + 1, () => 0),
						stack: [{ source, precedingNode, grammarContext }]
					});
					
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