const Component = require('./src/Component');
const Grammar = require('./src/Grammar');
const Variant = require('./src/Variant');
const Rule = require('./src/Rule');

const grammar = new Grammar({
	int: new Variant([
		Rule.begin().one().regexp(/[0-9]+/),
		Rule.throw('Expected an Integer')
	]),
	expression: new Variant([
		Rule.begin().one().variant('int', 'firstValue').followedBy().one().string('+', 'operator').followedBy().one().variant('expression', 'secondValue'),
		Rule.begin().one().variant('int', 'firstValue'),
		Rule.throw('Expected an Expression')
	])
});

let result = grammar.parse('1 + 2', 'expression').toJSON();

console.log(JSON.stringify(result, null, 2));