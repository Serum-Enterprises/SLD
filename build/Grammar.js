"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grammar = void 0;
const Util_1 = require("./Util");
class Grammar {
    /**
     * Create a new Grammar with an optional initial set of RuleSets
     */
    static create(ruleSets = {}) {
        return new Grammar(ruleSets);
    }
    _ruleSets;
    /**
     * Create a new Grammar Instance
     */
    constructor(ruleSets) {
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
    registerRuleSet(name, ruleSet) {
        this._ruleSets[name] = ruleSet;
    }
    /**
     * Unregister a RuleSet
     */
    unregisterRuleSet(name) {
        delete this._ruleSets[name];
    }
    /**
     * Verify that all RuleSets used do exist on the Grammar
     * This Method returns a list of all RuleSets that do not exist
     */
    _verifyRuleSetExistence() {
        const existingRuleSetNames = Object.keys(this.ruleSets);
        const result = [];
        Object.entries(this._ruleSets).forEach(([name, ruleSet]) => {
            ruleSet.rules.forEach(rule => {
                if (rule.recoverySymbol.isSomeAnd(recoverSymbol => recoverSymbol.type === 'RULESET' && !existingRuleSetNames.includes(recoverSymbol.value)))
                    result.push(name);
                rule.symbolSets.forEach(symbolSet => {
                    symbolSet.symbols.forEach(symbol => {
                        if (symbol.type === 'RULESET' && !existingRuleSetNames.includes(symbol.value))
                            result.push(name);
                    });
                });
            });
        });
        return [];
    }
    /**
     * Parse a source String
     */
    parse(source, rootRuleSet, failOnRest = false, precedingNode) {
        if (!Object.keys(this.ruleSets).includes(rootRuleSet))
            return Util_1.Result.Err({ message: `RuleSet "${rootRuleSet}" does not exist`, location: 0, stack: [] });
        const missingRuleSets = this._verifyRuleSetExistence();
        if (missingRuleSets.length > 0)
            return Util_1.Result.Err({ message: `RuleSet(s) ${missingRuleSets.join(', ')} do not exist`, location: 0, stack: [] });
        const result = this.ruleSets[rootRuleSet].parse(source, precedingNode, this);
        if (result.isOk()) {
            if (failOnRest && result.value.raw !== source)
                return Util_1.Result.Err({ message: 'Expected End of File', location: result.value.range[1] + 1, stack: [] });
            return result;
        }
        return result;
    }
}
exports.Grammar = Grammar;
module.exports = { Grammar };
