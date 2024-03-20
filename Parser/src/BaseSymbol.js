const Core = require('../../Core');

const { MisMatchError } = require('./errors/MisMatchError');
const { EmptyStringError } = require('./errors/EmptyStringError');
const { RuleSetError } = require('./errors/RuleSetError');

class BaseSymbol extends Core.BaseSymbol {
	/**
	 * Find this BaseSymbol in the source and return a Recovery Node or null
	 * @param {string} source 
	 * @param {Core.Node | null} precedingNode 
	 * @param {Core.Grammar} grammarContext
	 * @returns {Core.Node | null}
	 */
	find(source, precedingNode, grammarContext) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Core.Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(grammarContext instanceof Core.Grammar))
			throw new TypeError('Expected grammarContext to be an instance of Grammar');

		let rest = source;
		let result = null;

		while (result === null && rest.length > 0) {
			try {
				result = this.parse(rest, precedingNode, grammarContext);
			}
			catch (error) {
				if (error instanceof EmptyStringError)
					return null;

				rest = rest.slice(1);
			}
		}

		if (!result)
			return null;

		const raw = source.slice(0, source.length - rest.length + result.raw.length);

		if (precedingNode)
			return precedingNode.createFollower('RECOVER', raw, {});

		return new Core.Node('RECOVER', raw, {}, [0, raw.length - 1]);
	}

	/**
	 * Parse this BaseSymbol
	 * @param {string} source 
	 * @param {Core.Node | null} precedingNode
	 * @param {Core.Grammar} grammarContext
	 * @returns {Core.Node}
	 */
	parse(source, precedingNode, grammarContext) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (!(precedingNode instanceof Core.Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(grammarContext instanceof Core.Grammar))
			throw new TypeError('Expected grammarContext to be an instance of Grammar');

		switch (this.type) {
			case 'STRING': {
				if (!source.startsWith(this.value))
					throw new MisMatchError(`Expected ${this.value}`, precedingNode ? precedingNode.range[1] + 1 : 0);

				if (precedingNode)
					return precedingNode.createFollower('MATCH', this.value, {});

				return new Core.Node('MATCH', this.value, {}, [0, this.value.length - 1]);
			}
			case 'REGEXP': {
				const match = source.match(new RegExp(this.value.startsWith('^') ? this.value : `^${this.value}`));

				if (!match)
					throw new MisMatchError(`Expected /^${this.value}/`, precedingNode ? precedingNode.range[1] + 1 : 0);

				if (match[0].length === 0)
					throw new EmptyStringError();

				if (precedingNode)
					return precedingNode.createFollower('MATCH', match[0], {});

				return new Core.Node('MATCH', match[0], {}, [0, match[0].length - 1]);
			}
			case 'RULESET': {
				const result = grammarContext.ruleSets[this.value].parse(source, precedingNode, grammarContext);

				if (precedingNode)
					return precedingNode.createFollower('MATCH', result.raw, result.children)

				return new Core.Node('MATCH', result.raw, result.children, [0, result.raw.length - 1]);
			}
		}
	}
}

module.exports = { BaseSymbol };