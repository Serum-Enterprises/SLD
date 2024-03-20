const Core = require('../../Core');

const { RuleSetError } = require('./errors/RuleSetError');
const { MisMatchError } = require('./errors/MisMatchError');

class Grammar extends Core.Grammar {
	/**
	 * Verify that all RuleSets used do exist on the Grammar
	 * This Method throws a RuleSetError if a RuleSet does not exist
	 * @returns {void}
	 */
	verifyRuleSetExistence() {
		const ruleSetNames = Object.keys(this.ruleSets);

		Object.entries(this.ruleSets).forEach(([name, ruleSet]) => {
			ruleSet.rules.forEach((rule, ruleIndex) => {
				if (rule.recoverSymbol instanceof Core.BaseSymbol && rule.recoverSymbol.type === 'RULESET' && !ruleSetNames.includes(rule.recoverSymbol.value))
					throw new RuleSetError(`RuleSet "${rule.recoverSymbol.value}" used as a Recovery Symbol at ${name}:#${ruleIndex} does not exist`);

				rule.symbolSets.forEach((symbolSet, symbolSetIndex) => {
					symbolSet.symbols.forEach((symbol, symbolIndex) => {
						if (symbol.type === 'RULESET' && !ruleSetNames.includes(symbol.value))
							throw new RuleSetError(`RuleSet "${symbol.value}" used at ${name}:Rule #${ruleIndex}:SymbolSet #${symbolSetIndex}:Symbol #${symbolIndex} does not exist`);
					});
				});
			})
		});
	}

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

		if (!Object.keys(this.ruleSets).includes(rootRuleSet))
			throw new RuleSetError(`RuleSet "${rootRuleSet}" used as the Root RuleSet does not exist`);

		this.verifyRuleSetExistence();

		const result = this.ruleSets[rootRuleSet].parse(source, precedingNode, this);

		if (failOnRest && result.raw !== source)
			throw new MisMatchError('Expected End of File', result.range[1] + 1);

		return result;
	}
}

module.exports = { Grammar };