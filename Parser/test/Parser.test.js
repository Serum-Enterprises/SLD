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
		jest.spyOn(Parser.prototype, 'parseRuleSet').mockImplementation(() => {
			throw new MisMatchError('Expected Hello World', 0);
		});

		expect(() => parser.parseBaseSymbol(new BaseSymbol('RULESET', 'Hello'), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected Hello World', 0));

		Parser.prototype.parseRuleSet.mockRestore();

		// RuleSetError with RuleSet
		jest.spyOn(Parser.prototype, 'parseRuleSet').mockImplementation(() => {
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
		// Type Guards
		expect(() => new Parser(new Grammar()).parseSymbolSet())
			.toThrow(new TypeError('Expected symbolSet to be an instance of SymbolSet'));
		expect(() => new Parser(new Grammar()).parseSymbolSet(new SymbolSet()))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parseSymbolSet(new SymbolSet(), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Test parseSymbolSet without a precedingNode
		expect(new Parser(new Grammar()).parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'Hello'),
			new BaseSymbol('REGEXP', '^\\s*'),
			new BaseSymbol('STRING', 'World')
		]), 'Hello World', null))
			.toStrictEqual({ rest: '', namedNodes: {}, currentPrecedingNode: new Node('MATCH', 'Hello World', {}, [0, 10]) });

		// Test parseSymbolSet with a precedingNode
		expect(new Parser(new Grammar()).parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'World', 'word')
		]), 'World', new Node('MATCH', 'Hello', {}, [1, 4])))
			.toStrictEqual({
				rest: '',
				namedNodes: {
					word: [new Node('MATCH', 'World', {}, [7, 11])]
				},
				currentPrecedingNode: new Node('MATCH', 'World', {}, [7, 11])
			});

		// Testing an optional SymbolSet
		expect(() => new Parser(new Grammar()).parseSymbolSet(new SymbolSet([
			new BaseSymbol('STRING', 'Hello'),
			new BaseSymbol('REGEXP', '^\\s*'),
			new BaseSymbol('STRING', 'World')
		], true), 'Hallo Welt', null))
			.toThrow(new MisMatchError('Expected Hello', 0));

		// Testing a SymbolSet with duplicate Symbol Names
		expect(new Parser(new Grammar()).parseSymbolSet(new SymbolSet([
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

	});

	test('Testing parseRule', () => {
		// Check Type Checking
		expect(() => new Parser(new Grammar()).parseRule())
			.toThrow(new TypeError('Expected rule to be an instance of Rule'));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([])))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([]), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Check throwing Rule
		expect(() => new Parser(new Grammar()).parseRule(new Rule([], 'Expected a Greeting'), 'Hello World', null))
			.toThrow(new CustomError('Expected a Greeting', 0));
		expect(() => new Parser(new Grammar()).parseRule(new Rule([], 'Expected a Greeting'), 'World', new Node('MATCH', 'Hello ', {}, [0, 5])))
			.toThrow(new CustomError('Expected a Greeting', 6));

		// Test Recovery
		expect(new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hallo Welt')
			])
		], null, new BaseSymbol('STRING', ';')), 'Hello World;', null).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'Hello World;', children: {}, range: [0, 11] });

		// Test Non-Recovery
		expect(() => new Parser(new Grammar()).parseRule(new Rule([
			new SymbolSet([
				new BaseSymbol('STRING', 'Hallo Welt')
			])
		], null, new BaseSymbol('STRING', ';')), 'Hello World', null).toJSON())
			.toThrow(new MisMatchError('Expected Hallo Welt', 11));

		// Test optional SymbolSets
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

		// Test Transformers
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
			return new Node({
				type: 'MATCH',
				raw: node.children.first[0].raw + node.children.last[0].raw,
				children: {},
				range: [node.children.first[0].range[0], node.children.last[0].range[1]]
			});
		}), 'Hello World', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'HelloWorld',
				children: {},
				range: [0, 10]
			});
	});

	test('Testing parseRuleSet', () => {
		// Test Type Checking
		expect(() => new Parser(new Grammar()).parseRuleSet())
			.toThrow(new TypeError('Expected ruleSet to be an instance of RuleSet'));
		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet()))
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet(), 'Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		// Testing Regular Usage
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
		]), 'Hello', null).toJSON())
			.toStrictEqual({
				type: 'MATCH',
				raw: 'Hello',
				children: {},
				range: [0, 4]
			});

		// Testing Alternation (a Rule fails - next one gets executed)
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
		expect(() => new Parser(new Grammar()).parseRuleSet(new RuleSet([
			new Rule([], 'Expected a Greeting'),
		]), 'Hello', null))
			.toThrow(new RuleSetError('No Rule matched', 0));

		// Test getting a RuleSetError if no Rule matched
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
			.toThrow(new RuleSetError('No Rule matched', 0));
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
		]), 'Hola', new Node('MATCH', 'Hello ', {}, [0, 5])))
			.toThrow(new RuleSetError('No Rule matched', 6));
	});

	test('Testing parse', () => {
		// Test Type Checking
		expect(() => new Parser(new Grammar()).parse())
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new Parser(new Grammar()).parse('Hello World'))
			.toThrow(new TypeError('Expected rootRuleSet to be a String'));
		expect(() => new Parser(new Grammar()).parse('Hello World', 'Hello World', 123))
			.toThrow(new TypeError('Expected failOnRest to be a Boolean'));
		expect(() => new Parser(new Grammar()).parse('Hello World', 'Hello World', true, 123))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));

		expect(() => new Parser(new Grammar()).parse('Hello World', 'greeting', true, null))
			.toThrow(new ReferenceError('Expected rootRuleSet to be an existing RuleSet'));
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
	});
});