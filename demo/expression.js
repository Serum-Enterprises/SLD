"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Grammar_1 = require("../src/Grammar");
const Variant_1 = require("../src/Variant");
const Rule_1 = require("../src/Rule");
const grammar = Grammar_1.GrammarBuilder.create({
    int: Variant_1.VariantBuilder.create([
        Rule_1.RuleBuilder.match.one.regexp(/[0-9]+/),
        Rule_1.RuleBuilder.throw('Expected an Integer')
    ]),
    expression: Variant_1.VariantBuilder.create([
        Rule_1.RuleBuilder.match.one.variant('expression').capture('firstValue')
            .followedBy.one.string('+', 'operator')
            .followedBy.one.variant('expression').capture('secondValue'),
        Rule_1.RuleBuilder.match.one.variant('int').capture('value'),
        Rule_1.RuleBuilder.throw('Expected an Expression')
    ])
});
exports.default = grammar;
