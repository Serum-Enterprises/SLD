const { Grammar, RuleSet, Rule } = require('./Builder');
const { Parser } = require('./Parser');

const grammar = Grammar.create({
	greeting: RuleSet.create([
		Rule.match().one().ruleset('german', 'greeting'),
		Rule.match().one().ruleset('english', 'greeting'),
		Rule.throw('Expected a Greeting')
	]),
	german: RuleSet.create([
		Rule.match().one().string('Hallo')
			.followedBy().one().regexp('[a-zA-Z]+', 'name')
			.followedBy().zeroOrMore().ruleset('namelist'),
		Rule.match().one().string('Hello')
			.throw('Expected a Name')
	]),
	english: RuleSet.create([
		Rule.match().one().string('Hello')
			.followedBy().one().regexp('[a-zA-Z]+', 'name')
			.followedBy().zeroOrMore().ruleset('namelist'),
		Rule.match().one().string('Hallo')
			.throw('Expected a Namelist')
	]),
	namelist: RuleSet.create([
		Rule.match().one().string(',')
			.followedBy().one().regexp('[a-zA-Z]+', 'name'),
	]),
});

const parser = new Parser(grammar);

console.log(JSON.stringify(parser.parse('Hello Philipp, Julia, Marcel', 'greeting'), null, 2));