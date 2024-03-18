const { Builder } = require('./index');
const { Grammar, RuleSet, Rule } = Builder;

/**
 * Get the first Node in the Array of a Children.
 * If the there is no Node present or the Child does not exist, it returns null.
 * @param {Builder.Node} node 
 * @param {string} name 
 * @returns {Builder.Node | null}
 */
function getFirstChild(node, name) {
	return name in node.children ? node.children[name][0] : null;
}

/**
 * Get the Precedence of an Operator
 * @param {string} operator 
 * @returns {number}
 */
function precedence(operator) {
	switch (operator.raw) {
		case '+':
		case '-':
			return 1;
		case '*':
		case '/':
			return 2;
		default:
			return 0;
	}
}

/**
 * Rotates the AST to the left if the Operator of the right Node has a higher Precedence than the Operator of the current Node.
 * Otherwise it returns the AST as it is.
 * @param {Builder.Node} node 
 * @returns {Builder.Node}
 */
function rotateTreeLeft(node) {
	const left = getFirstChild(node, 'left');
	const operator = getFirstChild(node, 'operator');
	const right = getFirstChild(node, 'right');

	// Don't even start if some of the required Nodes are missing
	if (left === null || operator === null || right === null)
		return node;

	const leftOfRight = getFirstChild(right, 'left');
	const operatorOfRight = getFirstChild(right, 'operator');
	const rightOfRight = getFirstChild(right, 'right');

	// Don't even start if some of the required Nodes are missing
	if (leftOfRight === null || operatorOfRight === null || rightOfRight === null)
		return node;

	// Check if the Operator of the right Node has a higher Precedence than the Operator of the current Node
	if (!(precedence(operatorOfRight) < precedence(operator)))
		return node;

	// Nodes are immutable, so we have to create a new Left Node
	const newLeft = new Builder.Node('MATCH', node.raw.slice(left.range[0], leftOfRight.range[1] + 1), {
		left: [left],
		operator: [operator],
		right: [leftOfRight],
	}, [left.range[0], leftOfRight.range[1]]);

	// Nodes are immutable, so we have to create a new Root Node
	const newRoot = new Builder.Node('MATCH', node.raw, {
		left: [newLeft],
		operator: [operatorOfRight],
		right: [rightOfRight],
	}, [node.range[0], node.range[1]]);

	// Return the new Root Node
	return newRoot;
}

const grammar = Grammar.create({
	// Match either a Number or a Recursive Expression
	// If it is a Recursive Expression, apply the rotateTreeLeft Transformer to counteract the left-associativity of the Operators
	Expression: RuleSet.create([
		Rule.match().one().ruleset('Number', 'left')
			.followedBy().one().ruleset('Operator', 'operator')
			.followedBy().one().ruleset('Expression', 'right')
			.transform(rotateTreeLeft),
		Rule.match().one().ruleset('Number'),
	]),
	// Match one of the Operators
	Operator: RuleSet.create([
		Rule.match().one().string('+'),
		Rule.match().one().string('-'),
		Rule.match().one().string('*'),
		Rule.match().one().string('/'),
	]),
	// This matches either a Float in the Format of 0.001 or .001 or a simple Integer
	Number: RuleSet.create([
		Rule.match().one().regexp(/\d*\.\d+/),
		Rule.match().one().regexp(/\d+/),
	])
});

console.log(
	JSON.stringify(
		grammar.parse("2 * 3 + 4 / 2", "Expression", true),
		null,
		2
	)
);