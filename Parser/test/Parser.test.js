const { Grammar, RuleSet, Rule, SymbolSet, BaseSymbol, Node } = require('../../Core');
const { MisMatchError } = require('../src/errors/MisMatchError');
const { RuleSetError } = require('../src/errors/RuleSetError');
const { CustomError } = require('../src/errors/CustomError');
const { EmptyStringError } = require('../src/errors/EmptyStringError');

const { Parser } = require('../src/Parser');

describe('Testing Parser', () => {
	test('Testing findBaseSymbol', () => {
		const parser = new Parser(new Grammar());
		const baseSymbol = new BaseSymbol('STRING', ';');

		// Type Guards
		expect(() => parser.findBaseSymbol())
			.toThrow(new TypeError('Expected baseSymbol to be an instance of BaseSymbol'));
		expect(() => parser.findBaseSymbol(new BaseSymbol('STRING', 'Hello World')))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => parser.findBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Non-existent Recovery String
		expect(parser.findBaseSymbol(baseSymbol, 'Hallo Welt', null))
			.toBe(null);
		// Empty RegExp Match
		expect(parser.findBaseSymbol(new BaseSymbol('REGEXP', ';*'), 'Hallo Welt', null))
			.toBe(null);

		// Recovery as last Character
		expect(parser.findBaseSymbol(baseSymbol, 'Hello World;', null))
			.toBeInstanceOf(Node);
		expect(parser.findBaseSymbol(baseSymbol, 'Hello World;', null).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'Hello World;', children: {}, range: [0, 11] });

		// Recovery as first Character
		expect(parser.findBaseSymbol(baseSymbol, ';Hello World', null))
			.toBeInstanceOf(Node);
		expect(parser.findBaseSymbol(baseSymbol, ';Hello World', null).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: ';', children: {}, range: [0, 0] });

		// Recovery in middle with precedingNode set
		expect(parser.findBaseSymbol(baseSymbol, 'World; My', new Node('MATCH', 'Hello ', {}, [0, 5])))
			.toBeInstanceOf(Node);
		expect(parser.findBaseSymbol(baseSymbol, 'World; My', new Node('MATCH', 'Hello ', {}, [0, 5])).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'World;', children: {}, range: [6, 11] });
	});

	test('Testing constructor', () => {
		expect(() => new Parser()).toThrow(new TypeError('Expected grammar to be an instance of Grammar'));

		expect(new Parser(new Grammar())).toBeInstanceOf(Parser);
	});

	test('Testing parseBaseSymbol', () => {
		const parser = new Parser(new Grammar());

		// Type Guards
		expect(() => parser.parseBaseSymbol())
			.toThrow(new TypeError('Expected baseSymbol to be an instance of BaseSymbol'));
		expect(() => parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World')))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Mismatch with String
		expect(() => parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected Hello World', 0));

		// Match with String
		expect(parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World', null))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World', null).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [0, 10] });

		// Match with String and precedingNode
		expect(parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('STRING', 'Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [1, 11] });

		// Mismatch with RegExp (and EmptyStringError)
		expect(() => parser.parseBaseSymbol(new BaseSymbol('REGEXP', 'Hello World'), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected /^Hello World/', 0));
		expect(() => parser.parseBaseSymbol(new BaseSymbol('REGEXP', 'Hello World'), 'Hallo Welt', new Node('MATCH', 'T', {}, [0, 0])))
			.toThrow(new MisMatchError('Expected /^Hello World/', 1));
		expect(() => parser.parseBaseSymbol(new BaseSymbol('REGEXP', ';*'), 'Hello World', null))
			.toThrow(new EmptyStringError());

		// Match with RegExp
		expect(parser.parseBaseSymbol(new BaseSymbol('REGEXP', 'Hello World'), 'Hello World', null))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('REGEXP', 'Hello World'), 'Hello World', null).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [0, 10] });

		// Match with RegExp and precedingNode
		expect(parser.parseBaseSymbol(new BaseSymbol('REGEXP', '^Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('REGEXP', '^Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [1, 11] });


		// Mismatch with RuleSet
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hello World', 0);
			});

		expect(() => parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello'), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected Hello World', 0));

		// RuleSetError with RuleSet
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementation(() => {
				throw new RuleSetError();
			});

		expect(() => parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello'), 'Hallo Welt', null))
			.toThrow(new MisMatchError(`Expected RuleSet "Hello"`, 0));

		expect(() => parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello'), 'Hallo Welt', new Node('MATCH', 'T', {}, [0, 0])))
			.toThrow(new MisMatchError(`Expected RuleSet "Hello"`, 1));

		Parser.prototype.parseRuleSet.mockRestore();

		// Match with RuleSet
		jest.spyOn(Parser.prototype, 'parseRuleSet').mockImplementation(() => {
			return new Node('MATCH', 'Hello World', {}, [0, 10]);
		});

		// Match with RuleSet
		expect(parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello World'), 'Hello World', null))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello World'), 'Hello World', null).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [0, 10] });

		// Match with RuleSet and precedingNode
		expect(parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])))
			.toBeInstanceOf(Node);
		expect(parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello World'), 'Hello World', new Node('MATCH', 'T', {}, [0, 0])).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'Hello World', children: {}, range: [1, 11] });

		// Restore mock
		Parser.prototype.parseRuleSet.mockRestore();
	});

	test('Testing parseSymbolSet', () => {
		const parser = new Parser(new Grammar());

		// Type Guards
		expect(() => parser.parseSymbolSet())
			.toThrow(new TypeError('Expected symbolSet to be an instance of SymbolSet'));
		expect(() => parser.parseSymbolSet(new SymbolSet()))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => parser.parseSymbolSet(new SymbolSet(), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		jest.spyOn(Parser.prototype, 'parseBaseSymbol')
			.mockImplementationOnce(() => new Node('MATCH', 'Hello', {}, [0, 4]))
			.mockImplementationOnce(() => new Node('MATCH', ' ', {}, [5, 5]))
			.mockImplementationOnce(() => new Node('MATCH', 'World', {}, [6, 10]));

		// parseSymbolSet without a precedingNode
		expect(parser.parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'Hello'),
			new BaseSymbol('REGEXP', '^\\s*'),
			new BaseSymbol('STRING', 'World')
		]), 'Hello World', null))
			.toStrictEqual({ rest: '', namedNodes: {}, currentPrecedingNode: new Node('MATCH', 'Hello World', {}, [0, 10]) });

		jest.spyOn(Parser.prototype, 'parseBaseSymbol')
			.mockImplementationOnce(() => new Node('MATCH', 'Hello', {}, [0, 4]))

		// parseSymbolSet with a precedingNode
		expect(parser.parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'World', 'word')
		]), 'World', new Node('MATCH', 'Hello', {}, [1, 4])))
			.toStrictEqual({
				rest: '',
				namedNodes: {
					word: [new Node('MATCH', 'World', {}, [7, 11])]
				},
				currentPrecedingNode: new Node('MATCH', 'World', {}, [7, 11])
			});

		jest.spyOn(Parser.prototype, 'parseBaseSymbol')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hello', 0);
			});

		// Optional SymbolSet
		expect(() => parser.parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'Hello'),
			new BaseSymbol('REGEXP', '^\\s*'),
			new BaseSymbol('STRING', 'World')
		], true), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected Hello', 0));

		jest.spyOn(Parser.prototype, 'parseBaseSymbol')
			.mockImplementationOnce(() => new Node('MATCH', '1', {}, [0, 0]))
			.mockImplementationOnce(() => new Node('MATCH', '+', {}, [1, 1]))
			.mockImplementationOnce(() => new Node('MATCH', '2', {}, [2, 2]));

		// SymbolSet with duplicate Symbol Names
		expect(parser.parseSymbolSet(new SymbolSet([
			new BaseSymbol('REGEXP', '^[0-9]', 'digit'),
			new BaseSymbol('STRING', '+', 'op'),
			new BaseSymbol('REGEXP', '^[0-9]', 'digit'),
		], false, true), '1+2', null))
			.toStrictEqual({
				rest: '', namedNodes: {
					digit: [
						new Node('MATCH', '1', {}, [0, 0]),
						new Node('MATCH', '2', {}, [2, 2])
					],
					op: [
						new Node('MATCH', '+', {}, [1, 1])
					]
				}, currentPrecedingNode: new Node('MATCH', '1,2,3', {}, [0, 10])
			});

		jest.spyOn(Parser.prototype, 'parseBaseSymbol')
			.mockImplementationOnce(() => {
				throw new EmptyStringError();
			})
			.mockImplementationOnce(() => new Node('MATCH', '+', {}, [0, 0]));

		// SymbolSet with EmptyStringError
		expect(parser.parseSymbolSet(new SymbolSet([
			new BaseSymbol('REGEXP', '^[0-9]*', 'digit'),
			new BaseSymbol('STRING', '+', 'op'),
		], false, false), '+', null))
			.toStrictEqual({
				rest: '', namedNodes: {
					op: [
						new Node('MATCH', '+', {}, [0, 0])
					]
				}, currentPrecedingNode: new Node('MATCH', '+', {}, [0, 0])
			});
	});

	test('Testing parseRule', () => {
		// Type Guards
		expect(() => new Parser(new Grammar()).parseRule())
			.toThrow(new TypeError('Expected rule to be an instance of Rule'));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([])))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([]), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Custom Error Rule
		expect(() => new Parser(new Grammar()).parseRule(new Rule([], 'Expected a Greeting'), 'Hello World', null))
			.toThrow(new CustomError('Expected a Greeting', 0));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([], 'Expected a Greeting'), 'World', new Node('MATCH', 'Hello ', {}, [0, 5])))
			.toThrow(new CustomError('Expected a Greeting', 6));

		// Test Recovery
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo Welt', 0);
			});

		jest.spyOn(Parser.prototype, 'findBaseSymbol')
			.mockImplementationOnce(() => {
				return new Node('RECOVER', 'Hello World;', {}, [0, 11]);
			});

		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hallo Welt')
			])
		], null, new BaseSymbol('STRING', ';')), 'Hello World;', null).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'Hello World;', children: {}, range: [0, 11] });

		// Test Non-Recovery
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo Welt', 0);
			});

		jest.spyOn(Parser.prototype, 'findBaseSymbol')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo Welt', 0);
			});

		expect(() => new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hallo Welt')
			])
		], null, new BaseSymbol('STRING', ';')), 'Hello World', null).toJSON())
			.toThrow(new MisMatchError('Expected Hallo Welt', 11));

		// Test missing Recovery
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo Welt', 0);
			});

		expect(() => new Parser(new Grammar()).parseRule(
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hallo Welt')
				])
			]),
			'Hello World',
			null
		)).toThrow(new MisMatchError('Expected Hallo Welt', 0));

		// Test optional SymbolSets
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				return {
					rest: ' World', namedNodes: {
						first: [new Node('MATCH', 'Hello', {}, [0, 4])]
					}, currentPrecedingNode: new Node('MATCH', 'Hello', {}, [0, 4])
				};
			})
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected cool', 0);
			})
			.mockImplementationOnce(() => {
				return {
					rest: '', namedNodes: {
						last: [new Node('MATCH', 'World', {}, [6, 10])]
					}, currentPrecedingNode: new Node('MATCH', 'World', {}, [6, 10])
				};
			});

		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hello', 'first'),
				new BaseSymbol('REGEXP', '^\\s*')
			]),
			new SymbolSet([
				new BaseSymbol('STRING', 'cool', 'middle'),
				new BaseSymbol('REGEXP', '^\\s*')
			], true),
			new SymbolSet([
				new BaseSymbol('STRING', 'World', 'last')
			])
		]), 'Hello World', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hello World',
				children: {
					first: [{ type: 'MATCH', raw: 'Hello', children: {}, range: [0, 4] }],
					last: [{ type: 'MATCH', raw: 'World', children: {}, range: [6, 10] }]
				},
				range: [0, 10]
			});

		// Test greedy SymbolSets
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				return { rest: '+234+345', namedNodes: {}, currentPrecedingNode: new Node('MATCH', '123', {}, [0, 2]) };
			})
			.mockImplementationOnce(() => {
				return {
					rest: '+345', namedNodes: {
						operators: [new Node('MATCH', '+', {}, [3, 3])]
					}, currentPrecedingNode: new Node('MATCH', '+234', {}, [3, 6])
				};
			})
			.mockImplementationOnce(() => {
				return {
					rest: '', namedNodes: {
						operators: [new Node('MATCH', '+', {}, [7, 7])]
					}, currentPrecedingNode: new Node('MATCH', '+345', {}, [7, 10])
				};
			})
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected +', 10);
			});

		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('REGEXP', '^[0-9]+')
			]),
			new SymbolSet([
				new BaseSymbol('STRING', '+', 'operators'),
				new BaseSymbol('REGEXP', '^[0-9]+')
			], false, true)
		]), '123+234+345', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: '123+234+345',
				children: {
					operators: [
						{ type: 'MATCH', raw: '+', children: {}, range: [3, 3] },
						{ type: 'MATCH', raw: '+', children: {}, range: [7, 7] }
					]
				},
				range: [0, 10]
			});

		// Test with precedingNode
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				return { rest: '', namedNodes: {}, currentPrecedingNode: new Node('MATCH', 'Hello', {}, [6, 10]) };
			});

		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'World')
			])
		]), 'World', new Node('MATCH', 'Hello ', {}, [0, 5])).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'World',
				children: {
				},
				range: [6, 10]
			});

		// Test invalid Transformer
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				return { rest: '', namedNodes: {}, currentPrecedingNode: new Node('MATCH', 'Hello', {}, [0, 4]) };
			});

		expect(() => new Parser(new Grammar()).parseRule(
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hello')
				])
			], null, null, () => null),
			'Hello',
			null
		)).toThrow(new TypeError('Expected transformer to return an instance of Node'));

		// Test Transformers
		jest.spyOn(Parser.prototype, 'parseSymbolSet')
			.mockImplementationOnce(() => {
				return {
					rest: ' World', namedNodes: {
						first: [new Node('MATCH', 'Hello', {}, [0, 4])]
					}, currentPrecedingNode: new Node('MATCH', 'Hello', {}, [0, 4])
				};
			})
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected cool', 0);
			})
			.mockImplementationOnce(() => {
				return {
					rest: '', namedNodes: {
						last: [new Node('MATCH', 'World', {}, [6, 10])]
					}, currentPrecedingNode: new Node('MATCH', 'World', {}, [6, 10])
				};
			});

		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hello', 'first'),
				new BaseSymbol('REGEXP', '^\\s*')
			]),
			new SymbolSet([
				new BaseSymbol('STRING', 'cool', 'middle'),
				new BaseSymbol('REGEXP', '^\\s*')
			], true),
			new SymbolSet([
				new BaseSymbol('STRING', 'World', 'last')
			])
		], null, null, (node) => {
			return new Node(
				'MATCH',
				node.children.first[0].raw + node.children.last[0].raw,
				{},
				[node.children.first[0].range[0], node.children.last[0].range[1]]
			);
		}), 'Hello World', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'HelloWorld',
				children: {},
				range: [0, 10]
			});
	});

	test('Testing parseRuleSet', () => {
		// Type Guards
		expect(() => new Parser(new Grammar()).parseRuleSet())
			.toThrow(new TypeError('Expected ruleSet to be an instance of RuleSet'));
		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet()))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet(), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Regular Usage
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hello', {}, [0, 4]);
			});

		expect(new Parser(new Grammar()).parseRuleSet(new RuleSet([
			new Rule([
				new SymbolSet([new BaseSymbol('STRING', 'Hello')])
			]),
			new Rule([
				new SymbolSet([new BaseSymbol('STRING', 'Hallo')])
			])
		]), 'Hello', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hello',
				children: {},
				range: [0, 4]
			});

		// Alternation (a Rule fails - next one gets executed)
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo', 0);
			})
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hallo', {}, [0, 4]);
			});

		expect(new Parser(new Grammar()).parseRuleSet(new RuleSet([
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hello')
				])
			]),
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hallo')
				])
			])
		]), 'Hallo', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hallo',
				children: {},
				range: [0, 4]
			});

		// Test Error Propagation if Error is not a MisMatchError
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				throw new CustomError('Expected a Greeting');
			});

		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet([
			new Rule([], 'Expected a Greeting'),
		]), 'Hello', null))
			.toThrow(new RuleSetError());

		// Test getting a RuleSetError if no Rule matched
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo', 0);
			})
			.mockImplementationOnce(() => {
				throw new MisMatchError('Expected Hallo', 0);
			});

		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet([
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hallo')
				])
			]),
			new Rule([
				new SymbolSet([
					new BaseSymbol('STRING', 'Hello')
				])
			])
		]), 'Hola', null))
			.toThrow(new RuleSetError());

		// Test Transformers
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hello', {}, [0, 4]);
			});

		expect(new Parser(new Grammar()).parseRuleSet(
			new RuleSet([
				new Rule([
					new SymbolSet([
						new BaseSymbol('STRING', 'Hello')
					])
				])
			], (node) => {
				return new Node(
					'MATCH',
					node.raw + ' World',
					{},
					[node.range[0], node.range[1] + 6]
				);
			}), 'Hello', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hello World',
				children: {},
				range: [0, 10]
			});

		// Test invalid Transformer
		jest.spyOn(Parser.prototype, 'parseRule')
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hello', {}, [0, 4]);
			});

		expect(() => new Parser(new Grammar()).parseRuleSet(
			new RuleSet([
				new Rule([
					new SymbolSet([
						new BaseSymbol('STRING', 'Hello')
					])
				])
			], () => {
				return null;
			}), 'Hello', null).toJSON()
		).toThrow(new TypeError('Expected transformer to return an instance of Node'));
	});

	test('Testing parse', () => {
		// Type Guards
		expect(() => new Parser(new Grammar()).parse())
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parse('Hello World'))
			.toThrow(new TypeError('Expected rootRuleSet to be a String'));
		expect(() => new Parser(new Grammar()).parse('Hello World', 'Hello World', 123))
			.toThrow(new TypeError('Expected failOnRest to be a Boolean'));
		expect(() => new Parser(new Grammar()).parse('Hello World', 'Hello World', true, 123))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// RuleSet existence
		expect(() => new Parser(new Grammar()).parse('Hello World', 'greeting', true, null))
			.toThrow(new ReferenceError('Expected rootRuleSet to be an existing RuleSet'));

		// EoF Error
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hello', {}, [0, 4]);
			});

		expect(() => new Parser(new Grammar({
			greeting: new RuleSet([
				new Rule([
					new SymbolSet([
						new BaseSymbol('STRING', 'Hello')
					])
				])
			])
		})).parse('Hello World', 'greeting', true, null))
			.toThrow(new MisMatchError('Expected End of File', 5));

		// Normal Usage
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementationOnce(() => {
				return new Node('MATCH', 'Hello', {}, [0, 4]);
			});

		expect(new Parser(new Grammar({
			greeting: new RuleSet([
				new Rule([
					new SymbolSet([
						new BaseSymbol('STRING', 'Hello')
					])
				])
			])
		})).parse('Hello', 'greeting', true, null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hello',
				children: {},
				range: [0, 4]
			});

		// RuleSetError
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementationOnce(() => {
				throw new RuleSetError();
			});

		expect(() => new Parser(
			new Grammar({
				greeting: new RuleSet([
					new Rule([
						new SymbolSet([
							new BaseSymbol('STRING', 'Hello')
						])
					])
				])
			})
		).parse('Hallo', 'greeting'))
			.toThrow(new MisMatchError(`Expected RuleSet "greeting"`, 0));

		// RuleSetError with precedingNode
		jest.spyOn(Parser.prototype, 'parseRuleSet')
			.mockImplementationOnce(() => {
				throw new RuleSetError();
			});

		expect(() => new Parser(
			new Grammar({
				greeting: new RuleSet([
					new Rule([
						new SymbolSet([
							new BaseSymbol('STRING', 'Hello')
						])
					])
				])
			})
		).parse('Hallo', 'greeting', false, new Node('MATCH', 'World ', {}, [0, 5])))
			.toThrow(new MisMatchError(`Expected RuleSet "greeting"`, 6));
	});
});