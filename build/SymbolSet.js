"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolSet = void 0;
const Util_1 = require("./Util");
const Util_2 = require("./Util");
class SymbolSet {
    _symbols;
    _optional;
    _greedy;
    constructor(symbols, optional, greedy) {
        this._symbols = symbols;
        this._optional = optional;
        this._greedy = greedy;
    }
    get symbols() {
        return this._symbols;
    }
    get optional() {
        return this._optional;
    }
    get greedy() {
        return this._greedy;
    }
    parse(source, precedingNode, grammarContext) {
        let rest = source;
        let currentPrecedingNode = precedingNode;
        const namedNodes = new Map();
        // Match every Symbol in the SymbolSet
        for (let baseSymbol of this._symbols) {
            const parseResult = baseSymbol.parse(rest, currentPrecedingNode, grammarContext);
            if (parseResult.isErr()) {
                if (this._optional)
                    continue;
                else
                    return parseResult; // TODO: Check if the Stack needs to be updated
            }
            else {
                const result = parseResult.value;
                baseSymbol.name.match(name => {
                    if (!namedNodes.has(name))
                        namedNodes.set(name, []);
                    namedNodes.get(name).push(result);
                }, () => { });
                rest = rest.slice(result.raw.length);
                currentPrecedingNode = Util_2.Option.Some(result);
            }
        }
        return Util_1.Result.Ok({
            rest,
            namedNodes,
            currentPrecedingNode
        });
    }
}
exports.SymbolSet = SymbolSet;
