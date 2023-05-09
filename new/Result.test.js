const Node = require('./Node');
const Result = require('./Result');

describe('Testing Result', () => {
	test('Result.create', () => {
		const result = Result.create('MATCH', {}, {}, 'Hello World', '');

		expect(result).toEqual({
			type: 'OK',
			node: Node.create('MATCH', {}, {}, 'Hello World'),
			rest: ''
		});

		expect(() => Result.create('MATCH', {}, {}, 'Hello World')).toThrow(new TypeError('Expected rest to be a String'));
	});

	test('Result.createFromNode', () => {
		const node = Node.create('MATCH', {}, {}, 'Hello World');
		const result = Result.createFromNode(node, '');

		expect(result).toEqual({
			type: 'OK',
			node: node,
			rest: ''
		});

		expect(() => Result.createFromNode(node)).toThrow(new TypeError('Expected rest to be a String'));
	});

	test('Result.calculate', () => {
		const precedingNode = Node.create('MATCH', {}, {}, 'Hello World');
		const result = Result.calculate(precedingNode, 'MATCH', {}, {}, 'How are you', '');

		expect(result).toEqual({
			type: 'OK',
			node: Node.calculate(precedingNode, 'MATCH', {}, {}, 'How are you'),
			rest: ''
		});

		expect(() => Result.calculate(precedingNode, 'MATCH', {}, {}, 'How are you')).toThrow(new TypeError('Expected rest to be a String'));
	});

	test('Result.calculateFromNode', () => {
		const precedingNode = Node.create('MATCH', {}, {}, 'Hello World');
		const node = Node.create('MATCH', {}, {}, 'How are you');
		const result = Result.calculateFromNode(precedingNode, node, '');

		expect(result).toEqual({
			type: 'OK',
			node: Node.calculate(precedingNode, 'MATCH', {}, {}, 'How are you'),
			rest: ''
		});

		expect(() => Result.calculateFromNode(precedingNode, node)).toThrow(new TypeError('Expected rest to be a String'));
	});

	test('Result.error', () => {
		const result = Result.error('This is a Test Error');

		expect(result).toEqual({
			type: 'ERROR',
			message: 'This is a Test Error'
		});

		expect(() => Result.error()).toThrow(new TypeError('Expected message to be a String'));
		expect(() => Result.error('')).toThrow(new RangeError('Expected message to be a non-empty String'));
	});

	test('Result.getRaw', () => {
		const firstResult = Result.create('MATCH', {}, {}, 'Hello World', '\nHow are you?');
		const secondResult = Result.create('MATCH', {}, {}, 'How are you?', '');

		expect(Result.getRaw(firstResult, secondResult)).toBe('Hello World\nHow are you?');
	});

	test('Result.verify', () => {
		const node = Node.create('MATCH', {}, {}, 'Hello World');

		expect(() => Result.verify({type: 'OK', node, rest: ''})).not.toThrow();
		expect(() => Result.verify({type: 'ERROR', message: 'This is a Test Error'})).not.toThrow();

		expect(() => Result.verify(null)).toThrow(new TypeError('Expected result to be an Object'));

		expect(() => Result.verify({type: null})).toThrow(new TypeError('Expected result.type to be a String'));
		expect(() => Result.verify({type: 'INVALID'})).toThrow(new RangeError(`Expected result.type to be either "OK" or "ERROR"`));

		expect(() => Result.verify({type: 'OK', node: null})).toThrow(new TypeError('Expected result.node to be an Object'));

		expect(() => Result.verify({type: 'OK', node: node, rest: null})).toThrow(new TypeError(`Expected result.rest to be a String`));

		expect(() => Result.verify({type: 'ERROR', message: null})).toThrow(new TypeError('Expected result.message to be a String'));
		expect(() => Result.verify({type: 'ERROR', message: ''})).toThrow(new RangeError('Expected result.message to be a non-empty String'));
	});

	test('Result.check', () => {
		const node = Node.create('MATCH', {}, {}, 'Hello World');

		expect(Result.check({type: 'OK', node, rest: ''})).toBe(true);
		expect(Result.check({type: 'ERROR', message: 'This is a Test Error'})).toBe(true);

		expect(Result.check(null)).toBe(false);
	});
});
