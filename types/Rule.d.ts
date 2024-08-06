import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';
import { BaseSymbol } from './BaseSymbol';
import { SymbolSet } from './SymbolSet';
import type { Grammar } from './Grammar';
export declare class Rule {
    static get match(): QuantitySelector;
    static throw(message: string): Rule;
    private _symbolSets;
    private _throwMessage;
    private _recoverySymbol;
    private _transformer;
    constructor(symbolSets: SymbolSet[], throwMessage: Option<string>, recoverySymbol: Option<BaseSymbol>, transformer: (node: Node) => Node);
    get symbolSets(): SymbolSet[];
    get throwMessage(): Option<string>;
    get recoverySymbol(): Option<BaseSymbol>;
    get transformer(): (node: Node) => Node;
    get recover(): SymbolSelector;
    throw(message: string): Rule;
    get followedBy(): QuantitySelector;
    get directlyFollowedBy(): QuantitySelector;
    transform(transformer: (node: Node) => Node): Rule;
    /**
     * Parse the give source with the Rule
     */
    parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError>;
}
declare class QuantitySelector {
    private _rule;
    private _whiteSpacePrefix;
    private _recoverySymbol;
    constructor(rule: Rule, whitespacePrefix: boolean, recoverySymbol: boolean);
    get rule(): Rule;
    get whitespacePrefix(): boolean;
    get recoverSymbol(): boolean;
    get one(): SymbolSelector;
    get zeroOrOne(): SymbolSelector;
    get zeroOrMore(): SymbolSelector;
    get oneOrMore(): SymbolSelector;
}
declare class SymbolSelector {
    private _rule;
    private _whiteSpacePrefix;
    private _optional;
    private _greedy;
    private _recoverySymbol;
    constructor(rule: Rule, whitespacePrefix: boolean, optional: boolean, greedy: boolean, recoverySymbol: boolean);
    get rule(): Rule;
    get whitespacePrefix(): boolean;
    get optional(): boolean;
    get greedy(): boolean;
    get recoverSymbol(): boolean;
    string(value: string, name?: string): Rule;
    regexp(value: RegExp, name?: string): Rule;
    ruleset(value: string, name?: string): Rule;
}
export {};
