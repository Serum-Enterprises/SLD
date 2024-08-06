import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';
import type { RuleSet } from './RuleSet';
export declare class Grammar {
    /**
     * Create a new Grammar with an optional initial set of RuleSets
     */
    static create(ruleSets?: {
        [key: string]: RuleSet;
    }): Grammar;
    private _ruleSets;
    /**
     * Create a new Grammar Instance
     */
    constructor(ruleSets: {
        [key: string]: RuleSet;
    });
    /**
     * Get all RuleSets
     */
    get ruleSets(): {
        [key: string]: RuleSet;
    };
    /**
     * Register a new RuleSet
     */
    registerRuleSet(name: string, ruleSet: RuleSet): void;
    /**
     * Unregister a RuleSet
     */
    unregisterRuleSet(name: string): void;
    /**
     * Verify that all RuleSets used do exist on the Grammar
     * This Method returns a list of all RuleSets that do not exist
     */
    private _verifyRuleSetExistence;
    /**
     * Parse a source String
     */
    parse(source: string, rootRuleSet: string, failOnRest: boolean | undefined, precedingNode: Option<Node>): Result<Node, ParseError>;
}
