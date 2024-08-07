# Serum Language Designer

The Serum Language Designer (SLD) is a powerful Tool to create and parse Languages.

## Features
- Easy and self-explaining Syntax
- Direct Parsing of Source to AST
- Source String Range for each Node and Error
- Recovery from Errors with Symbols
- Customizable Error Messages
- Transforming Functions for AST Nodes

## Usage

### Installation

To install the SLD, you can use the following command:

```sh
npm install @serum-enterprises/sld
```

### Utilities

The SLD features a set of Utility Classes that help with development in general. These are:
 - `Option<T>`: A Rust-like Option Type that can be either `Some<T>` or `None`.
 - `Result<T, E>`: A Rust-like Result Type that can be either `Ok<T>` or `Err<E>`.

 Both of these Types are useful for Error Handling and can be used in combination with the SLD. They are also used in the SLD itself for Error Handling. Additionally, they have a method called `match` that can be used to match the Type and get the Value or Error out of it.

### Example

In this example we want to create a Grammar that creates an AST for a basic Calculator. It should support `+`, `-`, `*` and `/` in an arbitrary Chain as well as single Numbers. Example inputs would be:
```txt
0.5 * 2
.5 + 123
2 * 3 + 4 / 2
```

The Problem with these Examples is that the Parser is left-associative, meaning that it will always parse the leftmost Operator first. This means that the last Example would be parsed as `((2 * 3) + 4) / 2` instead of `(2 * 3) + (4 / 2)`. To fix this we need a so called Transformer Function. A Transformer Function can be Hooked into a Rule or RuleSet and will get called with the Node that was created by the Rule or RuleSet. It can then run some Transformations and return a new Node. This is also useful for static Analysis or to expand a simple Instructions into a set of more complex Instructions.

To start creating the Transformer Function we will first create some simple Helper Functions:

```js
/**
 * Get the first Node in the Array of a Children.
 * If the there is no Node present or the Child does not exist, it returns null.
 * @param {Node} node 
 * @param {string} name 
 * @returns {Option<Node>}
 */
function getFirstChild(node, name) {
	return name in node.children ? node.children[name][0] : null;
}
```

```js
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
```

With these Helper Functions, the Transformer Function (which is basically a simple Left-Rotation of the AST) can be created:

```js
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
	const newLeft = new Node('MATCH', node.raw.slice(left.range[0], leftOfRight.range[1] + 1), {
		left: [left],
		operator: [operator],
		right: [leftOfRight],
	}, [left.range[0], leftOfRight.range[1]]);

	// Nodes are immutable, so we have to create a new Root Node
	const newRoot = new Node('MATCH', node.raw, {
		left: [newLeft],
		operator: [operatorOfRight],
		right: [rightOfRight],
	}, [node.range[0], node.range[1]]);

	// Return the new Root Node
	return newRoot;
}
```

Now that we created the Transformer Function, we can start creating the Grammar.

```js
const grammar = Grammar.create();

const Expression = RuleSet.create([
	Rule.match.one.ruleset('Number', 'left')
		.followedBy.one.ruleset('Operator', 'operator')
		.followedBy.one.ruleset('Expression', 'right')
		.transform(rotateTreeLeft),
	Rule.match.one.ruleset('Number'),
]);

const Operator = RuleSet.create([
	Rule.match.one.string('+'),
	Rule.match.one.string('-'),
	Rule.match.one.string('*'),
	Rule.match.one.string('/'),
]);

const Number = RuleSet.create([
	Rule.match.one.regexp(/\d*\.\d+/),
	Rule.match.one.regexp(/\d+/),
]);

grammar.registerRuleSet('Expression', Expression);
grammar.registerRuleSet('Operator', Operator);
grammar.registerRuleSet('Number', Number);
```

We can now called the parse Method of the Grammar to parse a Source String:

```js
console.log(
	JSON.stringify(
		grammar.parse("2 * 3 + 4 / 2", "Expression", true, Option.None()),
		null,
		2
	)
);
```

The Result of this would look like this:

```json
{
    "type": "MATCH",
    "raw": "2 * 3 + 4 / 2",
    "children": {
        "left": [
            {
                "type": "MATCH",
                "raw": "2 * 3",
                "children": {
                    "left": [
                        {
                            "type": "MATCH",
                            "raw": "2",
                            "children": {},
                            "range": [
                                0,
                                0
                            ]
                        }
                    ],
                    "operator": [
                        {
                            "type": "MATCH",
                            "raw": "*",
                            "children": {},
                            "range": [
                                2,
                                2
                            ]
                        }
                    ],
                    "right": [
                        {
                            "type": "MATCH",
                            "raw": "3",
                            "children": {},
                            "range": [
                                4,
                                4
                            ]
                        }
                    ]
                },
                "range": [
                    0,
                    4
                ]
            }
        ],
        "operator": [
            {
                "type": "MATCH",
                "raw": "+",
                "children": {},
                "range": [
                    6,
                    6
                ]
            }
        ],
        "right": [
            {
                "type": "MATCH",
                "raw": "4 / 2",
                "children": {
                    "left": [
                        {
                            "type": "MATCH",
                            "raw": "4",
                            "children": {},
                            "range": [
                                8,
                                8
                            ]
                        }
                    ],
                    "operator": [
                        {
                            "type": "MATCH",
                            "raw": "/",
                            "children": {},
                            "range": [
                                10,
                                10
                            ]
                        }
                    ],
                    "right": [
                        {
                            "type": "MATCH",
                            "raw": "2",
                            "children": {},
                            "range": [
                                12,
                                12
                            ]
                        }
                    ]
                },
                "range": [
                    8,
                    12
                ]
            }
        ]
    },
    "range": [
        0,
        12
    ]
}
```