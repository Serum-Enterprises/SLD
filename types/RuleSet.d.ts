import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';
import type { Rule } from './Rule';
import type { Grammar } from './Grammar';
export declare class RuleSet {
    static create(rules?: Rule[]): RuleSet;
    private _rules;
    private _transformer;
    constructor(rules: Rule[], transformer: (node: Node) => Node);
    /**
     * Set a Transformer function for this RuleSet
     * @param {(node: Parser.Node) => Parser.Node} transformer
     * @returns {RuleSet}
     */
    transform(transformer: (node: Node) => Node): RuleSet;
    get rules(): Rule[];
    get transformer(): (node: Node) => Node;
    parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError>;
}
