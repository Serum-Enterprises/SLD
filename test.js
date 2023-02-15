const {
    Parser,
    RuleSet,
    Rule,
    Component
} = require('./index.js');
const {Meta} = require('./lib/Meta');

const expression = new RuleSet([
	Rule.begin(Component.matchRegex(/^\d+/, 'left'))
		.directlyFollowedBy(Component.matchRegex(/^\+/, 'operator'))
		.directlyFollowedBy(Component.matchRuleSet('expression', 'right'))
		.end(function() {
			this.type = 'expression';
			return this;
		}),
	Rule.begin(Component.matchRegex(/^\d+/, 'value'))
		.end(function() {
			this.type = 'value';
			return this;
		})
]);

const parser = new Parser(expression, [
	['expression', expression]
]);

console.log(JSON.stringify(parser.execute('1+2'), /*function(key, value) {
	if(this[key] instanceof Meta)
		return undefined;

	return value;
}*/null, 4));