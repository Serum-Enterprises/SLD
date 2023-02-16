const { Result } = require('../lib/Result.class');
const { Node } = require('../lib/Node.class');

const { LookupError } = require('./Errors.class');

class Component {
	static matchString(string) {
		if (typeof string !== 'string')
			throw new TypeError('Expected string to be a String');

		return (input, precedingNode) => {
			if (!input.startsWith(string))
				return null;

			if (precedingNode === null)
				return new Result(Node.createNode(string, string), input.slice(string.length));

			return new Result(precedingNode.calculateNode(string, string), input.slice(string.length));
		};
	}

	static matchRegex(regex) {
		if (!(regex instanceof RegExp))
			throw new TypeError('Expected regex to be an instance of RegExp');

		return (input, precedingNode) => {
			const match = input.match(regex);

			if (match === null)
				return null;

			if (precedingNode === null)
				return new Result(Node.createNode(match[0], match[0]), input.slice(match[0].length));

			return new Result(precedingNode.calculateNode(match[0], match[0]), input.slice(match[0].length));
		};
	}

	static matchWhitespace() {
		return Component.matchRegex(/^\s+/);
	}

	static matchRuleSet(ruleSetName) {
		if (typeof ruleSetName !== 'string')
			throw new TypeError('Expected ruleSetName to be a String');

		return (input, precedingNode, parserContext) => {
			if (!parserContext.has(ruleSetName))
				throw new LookupError(`RuleSet ${ruleSetName} not found.`);

			const ruleSet = parserContext.get(ruleSetName);

			return ruleSet.execute(input, precedingNode, parserContext);
		};
	}
}

module.exports = { Component };