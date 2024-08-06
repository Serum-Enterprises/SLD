import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';

import type { RuleSet } from './RuleSet';

export class Grammar {
	/**
	 * Create a new Grammar with an optional initial set of RuleSets
	 */
	static create(ruleSets: { [key: string]: RuleSet } = {}): Grammar {
		return new Grammar(ruleSets);
	}

	private _ruleSets: { [key: string]: RuleSet };

	/**
	 * Create a new Grammar Instance
	 */
	constructor(ruleSets: { [key: string]: RuleSet }) {
		this._ruleSets = ruleSets;
	}

	/**
	 * Get all RuleSets
	 */
	get ruleSets() {
		return this._ruleSets;
	}

	/**
	 * Register a new RuleSet
	 */
	registerRuleSet(name: string, ruleSet: RuleSet) {
		this._ruleSets[name] = ruleSet;
	}

	/**
	 * Unregister a RuleSet
	 */
	unregisterRuleSet(name: string) {
		delete this._ruleSets[name];
	}

	/**
	 * Verify that all RuleSets used do exist on the Grammar
	 * This Method returns a list of all RuleSets that do not exist
	 */
	private _verifyRuleSetExistence(): string[] {
		const existingRuleSetNames = Object.keys(this.ruleSets);
		const result = [];

		Object.entries(this._ruleSets).forEach(([name, ruleSet]) => {
			ruleSet.rules.forEach(rule => {
				if (rule.recoverySymbol.isSomeAnd(recoverSymbol => recoverSymbol.type === 'RULESET' && !existingRuleSetNames.includes((recoverSymbol.value as string))))
					result.push(name);

				rule.symbolSets.forEach(symbolSet => {
					symbolSet.symbols.forEach(symbol => {
						if (symbol.type === 'RULESET' && !existingRuleSetNames.includes((symbol.value as string)))
							result.push(name);
					});
				});
			})
		});

		return [];
	}

	/**
	 * Parse a source String
	 */
	parse(source: string, rootRuleSet: string, failOnRest: boolean = false, precedingNode: Option<Node>): Result<Node, ParseError> {
		if (!Object.keys(this.ruleSets).includes(rootRuleSet))
			return Result.Err({ message: `RuleSet "${rootRuleSet}" does not exist`, location: 0, stack: [] });

		const missingRuleSets = this._verifyRuleSetExistence();

		if(missingRuleSets.length > 0)
			return Result.Err({ message: `RuleSet(s) ${missingRuleSets.join(', ')} do not exist`, location: 0, stack: [] });

		const result = this.ruleSets[rootRuleSet].parse(source, precedingNode, this);

		if (result.isOk()) {
			if (failOnRest && result.value.raw !== source)
				return Result.Err({ message: 'Expected End of File', location: result.value.range[1] + 1, stack: [] });

			return result;
		}

		return result;
	}
}

module.exports = { Grammar };