const Core = require('../../Core');

const { RuleSetError } = require('./errors/RuleSetError');

class RuleSet extends Core.RuleSet {
	/** Parse a RuleSet and return the Node that was parsed
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

		let result = null;
		let errors = [];

		for (let i = 0; i < this.rules.length; i++) {
			try {
				result = this.rules[i].parse(source, precedingNode, grammarContext);
				break;
			}
			catch (error) {
				errors.push(error);
			}
		}

		if (!result)
			throw new RuleSetError(`No Rule was able to parse the source at Position ${precedingNode ? precedingNode.range[0] : 0}`, { cause: errors });

		// Transform the given Node if a transformer was set
		if (this.transformer) {
			result = this.transformer(result);

			if (!(result instanceof Core.Node))
				throw new TypeError('Expected transformer to return an instance of Node');
		}

		return result;
	}
}

module.exports = { RuleSet };