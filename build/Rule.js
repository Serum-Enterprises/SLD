"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const Util_1 = require("./Util");
const Util_2 = require("./Util");
const Util_3 = require("./Util");
const BaseSymbol_1 = require("./BaseSymbol");
const SymbolSet_1 = require("./SymbolSet");
class Rule {
    static get match() {
        return new QuantitySelector(new Rule([], Util_2.Option.None(), Util_2.Option.None(), node => node), false, false);
    }
    static throw(message) {
        return new Rule([], Util_2.Option.Some(message), Util_2.Option.None(), node => node);
    }
    _symbolSets;
    _throwMessage;
    _recoverySymbol;
    _transformer;
    constructor(symbolSets, throwMessage, recoverySymbol, transformer) {
        this._symbolSets = symbolSets;
        this._throwMessage = throwMessage;
        this._recoverySymbol = recoverySymbol;
        this._transformer = transformer;
    }
    get symbolSets() {
        return this._symbolSets;
    }
    get throwMessage() {
        return this._throwMessage;
    }
    get recoverySymbol() {
        return this._recoverySymbol;
    }
    get transformer() {
        return this._transformer;
    }
    get recover() {
        return new SymbolSelector(this, false, false, false, true);
    }
    throw(message) {
        this._throwMessage = Util_2.Option.Some(message);
        return this;
    }
    get followedBy() {
        return new QuantitySelector(this, true, false);
    }
    get directlyFollowedBy() {
        return new QuantitySelector(this, false, false);
    }
    transform(transformer) {
        this._transformer = transformer;
        return this;
    }
    /**
     * Parse the give source with the Rule
     */
    parse(source, precedingNode, grammarContext) {
        let rest = source;
        let currentPrecedingNode = precedingNode;
        let namedNodes = new Map();
        // If a Custom Throw Message was set, throw an Error
        if (this._throwMessage.isSome())
            return Util_1.Result.Err({
                message: this._throwMessage.value,
                location: precedingNode.match(node => node.range[1] + 1, () => 0),
                stack: [{ source, precedingNode, grammarContext }]
            });
        // Loop through all SymbolSets
        for (const symbolSet of this._symbolSets) {
            const parseResult = symbolSet.parse(rest, currentPrecedingNode, grammarContext);
            if (parseResult.isOk()) {
                // If there was no Error, update the rest, namedNodes and currentPrecedingNode
                rest = parseResult.value.rest;
                namedNodes = Util_3.Node.mergeNodeMaps([namedNodes, parseResult.value.namedNodes]);
                currentPrecedingNode = parseResult.value.currentPrecedingNode;
                // If the SymbolSet is greedy, try to match until there is an Error and always update rest, namedNodes and currentPrecedingNode
                if (symbolSet.greedy) {
                    while (true) {
                        const parseResult = symbolSet.parse(rest, currentPrecedingNode, grammarContext);
                        if (parseResult.isOk()) {
                            rest = parseResult.value.rest;
                            namedNodes = Util_3.Node.mergeNodeMaps([namedNodes, parseResult.value.namedNodes]);
                            currentPrecedingNode = parseResult.value.currentPrecedingNode;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            else {
                // If there was an Error and the SymbolSet is optional, continue with the next SymbolSet
                if (symbolSet.optional)
                    continue;
                // If the SymbolSet is not optional, check if the recoverSymbol is set
                if (this._recoverySymbol.isSome()) {
                    const recoverResult = this.recoverySymbol.value.find(source, currentPrecedingNode, grammarContext);
                    // If the recoverSymbol was found, return it's Node, otherwise propagate the Error
                    if (recoverResult.isSome())
                        return Util_1.Result.Ok(recoverResult.value);
                    // TODO: Check if the Error Stack needs to be updated
                    return Util_1.Result.Err(parseResult.error);
                }
                // If the SymbolSet is not optional and no recoverSymbol was set, propagate the Error
                // TODO: Check if the Error Stack needs to be updated
                return Util_1.Result.Err(parseResult.error);
            }
        }
        // Create the result Node
        const node = Util_3.Node.createFollowerWith(precedingNode, source.slice(0, source.length - rest.length), Util_2.Option.Some(namedNodes));
        // Run the Node through the transformer and return the Result
        return Util_1.Result.Ok(this._transformer(node));
    }
}
exports.Rule = Rule;
class QuantitySelector {
    _rule;
    _whiteSpacePrefix;
    _recoverySymbol;
    constructor(rule, whitespacePrefix, recoverySymbol) {
        this._rule = rule;
        this._whiteSpacePrefix = whitespacePrefix;
        this._recoverySymbol = recoverySymbol;
    }
    get rule() {
        return this._rule;
    }
    get whitespacePrefix() {
        return this._whiteSpacePrefix;
    }
    get recoverSymbol() {
        return this._recoverySymbol;
    }
    get one() {
        return new SymbolSelector(this._rule, this._whiteSpacePrefix, false, false, this._recoverySymbol);
    }
    get zeroOrOne() {
        return new SymbolSelector(this._rule, this._whiteSpacePrefix, true, false, this._recoverySymbol);
    }
    get zeroOrMore() {
        return new SymbolSelector(this._rule, this._whiteSpacePrefix, true, true, this._recoverySymbol);
    }
    get oneOrMore() {
        return new SymbolSelector(this._rule, this._whiteSpacePrefix, false, true, this._recoverySymbol);
    }
}
class SymbolSelector {
    _rule;
    _whiteSpacePrefix;
    _optional;
    _greedy;
    _recoverySymbol;
    constructor(rule, whitespacePrefix, optional, greedy, recoverySymbol) {
        this._rule = rule;
        this._whiteSpacePrefix = whitespacePrefix;
        this._optional = optional;
        this._greedy = greedy;
        this._recoverySymbol = recoverySymbol;
    }
    get rule() {
        return this._rule;
    }
    get whitespacePrefix() {
        return this._whiteSpacePrefix;
    }
    get optional() {
        return this._optional;
    }
    get greedy() {
        return this._greedy;
    }
    get recoverSymbol() {
        return this._recoverySymbol;
    }
    string(value, name = '') {
        if (this._recoverySymbol)
            return new Rule(this._rule.symbolSets, this._rule.throwMessage, Util_2.Option.Some(new BaseSymbol_1.BaseSymbol('STRING', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))), this._rule.transformer);
        else
            return new Rule([
                ...this._rule.symbolSets,
                new SymbolSet_1.SymbolSet([
                    ...(this._whiteSpacePrefix ? [new BaseSymbol_1.BaseSymbol('REGEXP', /\s*/, Util_2.Option.None())] : []),
                    new BaseSymbol_1.BaseSymbol('STRING', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))
                ], this._optional, this._greedy)
            ], this._rule.throwMessage, this._rule.recoverySymbol, this._rule.transformer);
    }
    regexp(value, name = '') {
        if (this._recoverySymbol)
            return new Rule(this._rule.symbolSets, this._rule.throwMessage, Util_2.Option.Some(new BaseSymbol_1.BaseSymbol('REGEXP', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))), this._rule.transformer);
        else
            return new Rule([
                ...this._rule.symbolSets,
                new SymbolSet_1.SymbolSet([
                    ...(this._whiteSpacePrefix ? [new BaseSymbol_1.BaseSymbol('REGEXP', /\s*/, Util_2.Option.None())] : []),
                    new BaseSymbol_1.BaseSymbol('REGEXP', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))
                ], this._optional, this._greedy)
            ], this._rule.throwMessage, this._rule.recoverySymbol, this._rule.transformer);
    }
    ruleset(value, name = '') {
        if (this._recoverySymbol)
            return new Rule(this._rule.symbolSets, this._rule.throwMessage, Util_2.Option.Some(new BaseSymbol_1.BaseSymbol('RULESET', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))), this._rule.transformer);
        else
            return new Rule([
                ...this._rule.symbolSets,
                new SymbolSet_1.SymbolSet([
                    ...(this._whiteSpacePrefix ? [new BaseSymbol_1.BaseSymbol('REGEXP', /\s*/, Util_2.Option.None())] : []),
                    new BaseSymbol_1.BaseSymbol('RULESET', value, name.length === 0 ? Util_2.Option.None() : Util_2.Option.Some(name))
                ], this._optional, this._greedy)
            ], this._rule.throwMessage, this._rule.recoverySymbol, this._rule.transformer);
    }
}
