const { Grammar, RuleSet, Rule } = require('./Builder');
const { Parser, Node } = require('./Parser');

const grammar = Grammar.create({
	sum: RuleSet.create([
		Rule.match().one().regexp('[0-9]+', 'lvalue')
			.followedBy().one().string('+')
			.followedBy().one().ruleset('sum', 'rvalue')
			.transform((node) => {
				return new Node(
					'MATCH',
					(parseInt(node.children.lvalue[0].raw) + parseInt(node.children.rvalue[0].raw)).toString(),
					{},
					[node.children.lvalue[0], node.children.rvalue[1]]
				);
			}),
		Rule.match().one().regexp('[0-9]+', 'value'),
		Rule.throw('Expected an Integer')
	])
});

const parser = new Parser(grammar);

console.log(JSON.stringify(parser.parse('1+2+3+4+5+6+7+8+9+10', 'sum').toJSON(), null, 2));