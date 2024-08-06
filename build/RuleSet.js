"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleSet = void 0;
const Util_1 = require("./Util");
const Util_2 = require("./Util");
class RuleSet {
    static create(rules = []) {
        return new RuleSet(rules, node => node);
    }
    _rules;
    _transformer;
    constructor(rules, transformer) {
        this._rules = rules;
        this._transformer = transformer;
    }
    /**
     * Set a Transformer function for this RuleSet
     * @param {(node: Parser.Node) => Parser.Node} transformer
     * @returns {RuleSet}
     */
    transform(transformer) {
        this._transformer = transformer;
        return this;
    }
    get rules() {
        return this._rules;
    }
    get transformer() {
        return this._transformer;
    }
    parse(source, precedingNode, grammarContext) {
        let result = Util_2.Option.None();
        let errors = [];
        for (const rule of this._rules) {
            const parseResult = rule.parse(source, precedingNode, grammarContext);
            if (parseResult.isOk()) {
                result = parseResult.OkToOption();
                break;
            }
            else {
                errors.push(parseResult.error);
            }
        }
        if (result.isNone())
            return Util_1.Result.Err({
                message: `Unable to Parse a Rule`,
                location: precedingNode.match(node => node.range[1] + 1, () => 0),
                // TODO: Check if the Error Stack needs to be updated
                stack: [{ source, precedingNode, grammarContext }]
            });
        // Run the Node through the transformer and return the Result
        return Util_1.Result.Ok(this._transformer(result.value));
    }
}
exports.RuleSet = RuleSet;
