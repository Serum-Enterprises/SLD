const { Grammar, RuleSet, Rule } = require('./Builder');
const { Parser } = require('./Parser');

const grammar = Grammar.create({
	sum: RuleSet.create([
		Rule.match().one().regexp('[0-9]+', 'lvalue')
			.followedBy().one().string('+')
			.followedBy().one().ruleset('sum', 'rvalue')
			.transform((node) => {
				return parseInt(node.children['lvalue']) + parseInt(node.children['rvalue']);
			}),
		Rule.match().one().regexp('[0-9]+', 'value')
			.transform((node) => {
				return parseInt(node.children['value'])
			}),
		Rule.throw('Expected an Integer')
	])
});

const parser = new Parser(grammar);

console.log(JSON.stringify(parser.parse('1+2+3+4+5+6+7+8+9+10', 'sum').toJSON(), null, 2));