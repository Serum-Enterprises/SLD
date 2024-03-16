const Core = require('../../Core');

const { RuleSetError } = require('./errors/RuleSetError');
const { MisMatchError } = require('./errors/MisMatchError');

class Grammar extends Core.Grammar {
	/**
	 * Parse a source String
	 * @param {string} source 
	 * @param {string} rootRuleSet 
	 * @param {boolean} failOnRest 
	 * @param {Core.Node | null} precedingNode 
	 * @returns {Core.Node}
	 */
	parse(source, rootRuleSet, failOnRest = false, precedingNode = null) {
		if (typeof source !== 'string')
			throw new TypeError('Expected source to be a String');

		if (typeof rootRuleSet !== 'string')
			throw new TypeError('Expected rootRuleSet to be a String');

		if (typeof failOnRest !== 'boolean')
			throw new TypeError('Expected failOnRest to be a Boolean');

		if (!(precedingNode instanceof Core.Node) && precedingNode !== null)
			throw new TypeError('Expected precedingNode to be an instance of Node or null');

		if (!(this.ruleSets[rootRuleSet] instanceof Core.RuleSet))
			throw new ReferenceError(`Expected rootRuleSet to be an existing RuleSet`);

		try {
			const result = this.ruleSets[rootRuleSet].parse(source, precedingNode, this);

			if (failOnRest && result.raw !== source)
				throw new MisMatchError('Expected End of File', result.range[1] + 1);

			return result;
		}
		catch (error) {
			if (error instanceof RuleSetError)
				throw new MisMatchError(`Expected RuleSet "${rootRuleSet}"`, precedingNode ? precedingNode.range[1] + 1 : 0);

			throw error;
		}
	}
}

module.exports = { Grammar };