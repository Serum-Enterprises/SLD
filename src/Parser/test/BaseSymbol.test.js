const { Node } = require('../../Core/src/Node');
const { BaseSymbol } = require('../src/BaseSymbol');
const { Grammar } = require('../src/Grammar');

describe('Testing BaseSymbol', () => {
	test('Testing find', () => {
		// Dummy Grammar for Testing
		const grammar = new Grammar();

		// Type Guards
		expect(() => new BaseSymbol('STRING', ';').find())
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new BaseSymbol('STRING', ';').find('Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));
		expect(() => new BaseSymbol('STRING', ';').find('Hello World', null))
			.toThrow(new TypeError('Expected grammarContext to be an instance of Grammar'));

		// Non-existent Recovery String
		expect(new BaseSymbol('STRING', ';').find('Hallo Welt', null, grammar))
			.toBe(null);
		// Empty RegExp Match (i.e. internal EmptyStringError)
		expect(new BaseSymbol('REGEXP', ';*').find('Hallo Welt', null, grammar))
			.toBe(null);

		// Recovery as last Character
		expect(new BaseSymbol('STRING', ';').find('Hello World;', null, grammar))
			.toBeInstanceOf(Node);
		expect(new BaseSymbol('STRING', ';').find('Hello World;', null, grammar).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'Hello World;', children: {}, range: [0, 11] });

		// Recovery as first Character
		expect(new BaseSymbol('STRING', ';').find(';Hello World', null, grammar))
			.toBeInstanceOf(Node);
		expect(new BaseSymbol('STRING', ';').find(';Hello World', null, grammar).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: ';', children: {}, range: [0, 0] });

		// Recovery in middle with precedingNode set
		expect(new BaseSymbol('STRING', ';').find('World; My', new Node('MATCH', 'Hello ', {}, [0, 5]), grammar))
			.toBeInstanceOf(Node);
		expect(new BaseSymbol('STRING', ';').find('World; My', new Node('MATCH', 'Hello ', {}, [0, 5]), grammar).toJSON())
			.toStrictEqual({ type: 'RECOVER', raw: 'World;', children: {}, range: [6, 11] });
	});

	test('Testing parse', () => {
		// Dummy Grammar for Testing
		const grammar = new Grammar();

		// Type Guards
		expect(() => new BaseSymbol('STRING', 'Hello World').parse())
			.toThrow(new TypeError('Expected source to be a String'));
		expect(() => new BaseSymbol('STRING', 'Hello World').parse('Hello World'))
			.toThrow(new TypeError('Expected precedingNode to be an instance of Node or null'));
		expect(() => new BaseSymbol('STRING', 'Hello World').parse('Hello World', null))
			.toThrow(new TypeError('Expected grammarContext to be an instance of Grammar'));

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
});
