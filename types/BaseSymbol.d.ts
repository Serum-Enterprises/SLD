import { Result } from './Util';
import { Option } from './Util';
import { Node, ParseError } from './Util';
import type { Grammar } from './Grammar';
export declare class BaseSymbol {
    private _type;
    private _value;
    private _name;
    constructor(type: "STRING" | "RULESET", value: string, name: Option<string>);
    constructor(type: "REGEXP", value: RegExp, name: Option<string>);
    get type(): "STRING" | "REGEXP" | "RULESET";
    get value(): string | RegExp;
    get name(): Option<string>;
    find(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Option<Node>;
    parse(source: string, precedingNode: Option<Node>, grammarContext: Grammar): Result<Node, ParseError>;
}
