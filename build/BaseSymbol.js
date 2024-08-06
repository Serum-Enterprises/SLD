"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSymbol = void 0;
const Util_1 = require("./Util");
const Util_2 = require("./Util");
const Util_3 = require("./Util");
class BaseSymbol {
    _type;
    _value;
    _name;
    constructor(type, value, name) {
        this._type = type;
        this._value = value;
        this._name = name;
    }
    get type() {
        return this._type;
    }
    get value() {
        return this._value;
    }
    get name() {
        return this._name;
    }
    find(source, precedingNode, grammarContext) {
        let rest = source;
        let result = Util_2.Option.None();
        while (result.isNone() && rest.length > 0) {
            const parseResult = this.parse(rest, precedingNode, grammarContext);
            result = parseResult.OkToOption();
            rest = rest.slice(1);
        }
        return result.mapSome(node => Util_3.Node.createFollowerWith(Util_2.Option.Some(node), node.raw, Util_2.Option.None()));
    }
    parse(source, precedingNode, grammarContext) {
        switch (this._type) {
            case 'STRING': {
                if (!source.startsWith(this._value))
                    return Util_1.Result.Err({
                        message: `Expected ${this._value}`,
                        location: precedingNode.match(node => node.range[1] + 1, () => 0),
                        stack: [{ source, precedingNode, grammarContext }]
                    });
                return Util_1.Result.Ok(Util_3.Node.createFollowerWith(precedingNode, this._value, Util_2.Option.None()));
            }
            case 'REGEXP': {
                const match = source.match(this._value.source.startsWith('^') ? this._value : new RegExp(`^${this._value.source}`, this._value.flags));
                if (!match)
                    return Util_1.Result.Err({
                        message: `Expected ${this._value.toString()}`,
                        location: precedingNode.match(node => node.range[1] + 1, () => 0),
                        stack: [{ source, precedingNode, grammarContext }]
                    });
                if (!match[0] || match[0].length === 0)
                    return Util_1.Result.Err({
                        message: `Empty Match`,
                        location: precedingNode.match(node => node.range[1] + 1, () => 0),
                        stack: [{ source, precedingNode, grammarContext }]
                    });
                return Util_1.Result.Ok(Util_3.Node.createFollowerWith(precedingNode, match[0], Util_2.Option.None()));
            }
            case 'RULESET': {
                // TODO: Check if the Stack needs to be updated
                return (grammarContext.ruleSets[this._value]).parse(source, precedingNode, grammarContext);
            }
        }
    }
}
exports.BaseSymbol = BaseSymbol;
