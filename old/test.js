const {
	Parser,
	RuleSet,
	Rule,
	Component
} = require('./src/index.js');
const fs = require('fs');

/*
Expression 	-> Expression > /^\+|\-/ > Term
Expression  -> Term
Term 		-> Term > /^\*|\// > Factor
Term 		-> Factor
Factor 		-> /^\(/ > Expression > /^\)/
Factor 		-> Integer
Integer 	-> /^\d+/
*/

const integer = new RuleSet([
	Rule.begin(/^\d+/, 'value'),
	Rule.throw('Expected an Integer')
]);
const term = new RuleSet([
	Rule.begin(Component.matchRuleSet('integer'), 'left')
		.followedBy(/^\/|\*/, 'operator')
		.followedBy(Component.matchRuleSet('term'), 'right'),
	Rule.begin(Component.matchRuleSet('integer'), 'value')
]);
const expression = new RuleSet([
	Rule.begin(Component.matchRuleSet('term'), 'left')
		.followedBy(/^\+|-/, 'operator')
		.followedBy(Component.matchRuleSet('expression'), 'right'),
	Rule.begin(Component.matchRuleSet('term'), 'value'),
]);

const parser = new Parser(expression, [
	['expression', expression],
	['term', term],
	['integer', integer]
]);

console.log(JSON.stringify(parser.execute('5 / 5 - 2', false), null, 4));
fs.writeFileSync('test.json', JSON.stringify(parser.execute('5 / 5 - 2', false), null, 4));