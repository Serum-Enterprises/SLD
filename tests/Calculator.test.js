const { Parser, RuleSet, Rule, Component } = require('../index.js');
const fs = require('fs');
const Util = require('../lib/Util.class');

const Expression = new RuleSet([
    Rule.begin(Component.matchRuleSet('Term', 'left'))
        .followedBy(Component.matchRegex(/^[+-]/, 'operator'))
        .followedBy(Component.matchRuleSet('Expression', 'right'))
        .end(function () {
            return {
                operator: this.operator,
                left: this.left,
                right: this.right
            };
        }),
    Rule.begin(Component.matchRuleSet('Term', 'value'))
        .end(function () {
            return this.value.data;
        }),
    Rule.begin(Component.matchRuleSet('Term', 'left'))
        .followedBy(Component.matchRegex(/^[+-]/, 'operator'))
        .throw('Expected Expression after operator'),
    Rule.begin(Component.matchRuleSet('Term', 'left'))
        .throw('Expected operator after Term')
]);
const Term = new RuleSet([
    Rule.begin(Component.matchRuleSet('Factor', 'left'))
        .followedBy(Component.matchRegex(/^[*\/]/, 'operator'))
        .followedBy(Component.matchRuleSet('Term', 'right'))
        .end(function () {
            return {
                operator: this.operator,
                left: this.left,
                right: this.right
            };
        }),
    Rule.begin(Component.matchRuleSet('Factor', 'value'))
        .end(function () {
            return this.value.data;
        }),
    Rule.begin(Component.matchRuleSet('Factor', 'left'))
        .followedBy(Component.matchRegex(/^[*\/]/, 'operator'))
        .throw('Expected Term after operator'),
    Rule.begin(Component.matchRuleSet('Factor', 'left'))
        .throw('Expected operator after Factor')
]);
const Factor = new RuleSet([
    Rule.begin(Component.matchString('('))
        .followedBy(Component.matchRuleSet('Expression', 'expression'))
        .followedBy(Component.matchString(')'))
        .end(function () {
            return this.expression.data;
        }),
    Rule.begin(Component.matchRegex(/^[0-9]+/, 'value'))
        .end(function () {
            return parseInt(this.value.data);
        }),
    Rule.begin(Component.matchString('('))
        .followedBy(Component.matchRuleSet('Expression', 'expression'))
        .throw('Expected LPARAN after expression'),
    Rule.begin(Component.matchString('('))
        .throw('Expected expression after LPARAN')
]);

const parser = new Parser(Expression, [
    ['Expression', Expression],
    ['Term', Term],
    ['Factor', Factor]
]);

const expression1 = '1 + 2 * 3 - 4 / 5';
fs.writeFileSync('./output/expression1.json', JSON.stringify(parser.execute(expression1), null, 4));
Util.printCharTable(expression1);

const expression2 = '1 + 2 * (3\r\n - 4) / 5';
fs.writeFileSync('./output/expression2.json', JSON.stringify(parser.execute(expression2), null, 4));
Util.printCharTable(expression2);