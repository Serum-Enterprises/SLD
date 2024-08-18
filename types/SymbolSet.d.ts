import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';
import type { BaseSymbol } from './BaseSymbol';
import type { Grammar } from './Grammar';
export type ParseResult = {
    rest: string;
    namedNodes: Map<string, Node[]>;
    currentPrecedingNode: Option<Node>;
};
export declare class SymbolSet {
    private _symbols;
    private _optional;
    private _greedy;
    constructor(symbols: BaseSymbol[], optional: boolean, greedy: boolean);
    get symbols(): BaseSymbol[];
    get optional(): boolean;
    get greedy(): boolean;
    parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<ParseResult, ParseError>;
}
