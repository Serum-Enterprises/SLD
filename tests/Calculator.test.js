const { Parser, RuleSet, Rule } = require('../index.js');
const fs = require('fs');
const Util = require('../Util/Util.class');

const Expression = RuleSet
	.addRule(
		Rule.begin(Rule.lookup('Term'), 'value')
			.end(function () {
				return this.value
			})
	)
	.addRule(
		Rule.begin(Rule.lookup('Term'), 'left')
			.followedBy(/^[+-]/, 'operator')
			.followedBy(Rule.lookup('Expression'), 'right')
			.end(function () {
				return {
					operator: this.operator,
					left: this.left,
					right: this.right
				}
			})
	)
	.addRule(
		Rule.begin(Rule.lookup('Term'), 'left')
			.followedBy(/^[+-]/, 'operator')
			.throw('Expected Expression after operator')
	)
	.addRule(
		Rule.begin(Rule.lookup('Term'), 'left')
			.throw('Expected operator after Term')
	);

const Term = RuleSet
	.addRule(
		Rule.begin(Rule.lookup('Factor'), 'value')
			.end(function () {
				return this.value
			})
	)
	.addRule(
		Rule.begin(Rule.lookup('Factor'), 'left')
			.followedBy(/^[*\/]/, 'operator')
			.followedBy(Rule.lookup('Term'), 'right')
			.end(function () {
				return {
					operator: this.operator,
					left: this.left,
					right: this.right
				}
			})
	)
	.addRule(
		Rule.begin(Rule.lookup('Factor'), 'left')
			.followedBy(/^[*\/]/, 'operator')
			.throw('Expected Term after operator')
	)
	.addRule(
		Rule.begin(Rule.lookup('Factor'), 'left')
			.throw('Expected operator after Factor')
	);

const Factor = RuleSet
	.addRule(
		Rule.begin(/^[0-9]+/, 'value')
			.end(function () {
				return parseInt(this.value)
			})
	)
	.addRule(
		Rule.begin('(')
			.followedBy(Rule.lookup('Factor'), 'expression')
			.followedBy(')')
			.end(function () {
				return this.expression
			})
	)
	.addRule(
		Rule.begin('(')
			.followedBy(Rule.lookup('Expression'), 'expression')
			.throw('Expected LPARAN after expression')
	)
	.addRule(
		Rule.begin('(')
			.throw('Expected expression after LPARAN')
	);


const parser = new Parser()
	.addRuleSet('Expression', Expression)
	.addRuleSet('Term', Term)
	.addRuleSet('Factor', Factor);

const expression1 = '1 + 2 * 3 - 4 / 5';
fs.writeFileSync('./output/expression1.json', JSON.stringify(parser.execute(expression1), null, 2));
fs.writeFileSync('./output/expression1.stringMap.txt', Util.printCharTable(expression1));

const expression2 = '1 + 2 * (3\n - 4) / 5';
fs.writeFileSync('./output/expression2.json', JSON.stringify(parser.execute(expression2), null, 2));
fs.writeFileSync('./output/expression2.stringMap.txt', Util.printCharTable(expression1));