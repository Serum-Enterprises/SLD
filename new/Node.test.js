const Meta = require('./Meta');
const Node = require('./Node');

describe('Testing Node', () => {
	test('Node.create', () => {
		const node = Node.create('MATCH', {}, {}, 'Hello World');

		expect(node).toEqual({
			type: 'MATCH',
			data: {},
			childNodes: {},
			raw: 'Hello World',
			meta: Meta.create('Hello World')
		});

		expect(() => Node.create(null)).toThrow(new TypeError('Expected type to be a String'));
		expect(() => Node.create('')).toThrow(new RangeError('Expected type to be either "MATCH" or "RECOVER"'));
		expect(() => Node.create('MATCH')).toThrow(new TypeError('Expected childNodes to be an Object'));
		expect(() => Node.create('MATCH', { 'first': null })).toThrow(new TypeError('Expected childNodes.first to be an Object'));
		expect(() => Node.create('MATCH', { 'first': [null] })).toThrow(new TypeError('Expected childNodes.first[0] to be an Object'));
		expect(() => Node.create('MATCH', {})).toThrow(new TypeError('Expected data to be valid JSON'));
		expect(() => Node.create('MATCH', {}, {})).toThrow(new TypeError('Expected raw to be a String'));
		expect(() => Node.create('MATCH', {}, {}, '')).toThrow(new RangeError('Expected raw to be a non-empty String'));
	});

	test('Node.createMatch', () => {
		const node = Node.createMatch({}, {}, 'Hello World');

		expect(node).toEqual({
			type: 'MATCH',
			data: {},
			childNodes: {},
			raw: 'Hello World',
			meta: Meta.create('Hello World')
		});
	});

	test('Node.createRecover', () => {
		const node = Node.createRecover({}, {}, 'Hello World');

		expect(node).toEqual({
			type: 'RECOVER',
			data: {},
			childNodes: {},
			raw: 'Hello World',
			meta: Meta.create('Hello World')
		});
	});

	test('Node.calculate', () => {
		const precedingNode = Node.create('MATCH', {}, {}, 'Hello World');
		const node = Node.calculate(precedingNode, 'MATCH', {}, {}, 'How are you');

		expect(node).toEqual({
			type: 'MATCH',
			data: {},
			childNodes: {},
			raw: 'How are you',
			meta: Meta.calculate(Meta.create('Hello World'), 'How are you')
		});

		expect(() => Node.calculate(precedingNode, null)).toThrow(new TypeError('Expected type to be a String'));
		expect(() => Node.calculate(precedingNode, '')).toThrow(new RangeError('Expected type to be either "MATCH" or "RECOVER"'));
		expect(() => Node.calculate(precedingNode, 'MATCH')).toThrow(new TypeError('Expected childNodes to be an Object'));
		expect(() => Node.calculate(precedingNode, 'MATCH', { 'first': null })).toThrow(new TypeError('Expected childNodes.first to be an Object'));
		expect(() => Node.calculate(precedingNode, 'MATCH', { 'first': [null] })).toThrow(new TypeError('Expected childNodes.first[0] to be an Object'));
		expect(() => Node.calculate(precedingNode, 'MATCH', {})).toThrow(new TypeError('Expected data to be valid JSON'));
		expect(() => Node.calculate(precedingNode, 'MATCH', {}, {})).toThrow(new TypeError('Expected raw to be a String'));
		expect(() => Node.calculate(precedingNode, 'MATCH', {}, {}, '')).toThrow(new RangeError('Expected raw to be a non-empty String'));
	});

	test('Node.calculateMatch', () => {
		const precedingNode = Node.create('MATCH', {}, {}, 'Hello World');
		const node = Node.calculateMatch(precedingNode, {}, {}, 'How are you');

		expect(node).toEqual({
			type: 'MATCH',
			data: {},
			childNodes: {},
			raw: 'How are you',
			meta: Meta.calculate(Meta.create('Hello World'), 'How are you')
		});
	});

	test('Node.calculateRecover', () => {
		const precedingNode = Node.create('MATCH', {}, {}, 'Hello World');
		const node = Node.calculateRecover(precedingNode, {}, {}, 'How are you');

		expect(node).toEqual({
			type: 'RECOVER',
			data: {},
			childNodes: {},
			raw: 'How are you',
			meta: Meta.calculate(Meta.create('Hello World'), 'How are you')
		});
	});

	test('Node.verify', () => {
		expect(() => Node.verify(null)).toThrow(new TypeError('Expected node to be an Object'));

		// Verify Type
		expect(() => Node.verify({type: null})).toThrow(new TypeError('Expected node.type to be a String'));
		expect(() => Node.verify({type: ''})).toThrow(new RangeError('Expected node.type to be either "MATCH" or "RECOVER"'));

		// Verify Child Nodes
		expect(() => Node.verify({type: 'MATCH', childNodes: null})).toThrow(new TypeError('Expected node.childNodes to be an Object'));
		expect(() => Node.verify({type: 'MATCH', childNodes: {first: null}})).toThrow(new TypeError('Expected node.childNodes.first to be an Object'));
		expect(() => Node.verify({type: 'MATCH', childNodes: {first: [null]}})).toThrow(new TypeError('Expected node.childNodes.first[0] to be an Object'));

		// Verify Data
		expect(() => Node.verify({type: 'MATCH', childNodes: {}, data: undefined})).toThrow(new TypeError('Expected node.data to be valid JSON'));

		// Verify Raw
		expect(() => Node.verify({type: 'MATCH', childNodes: {}, data: {}, raw: null})).toThrow(new TypeError('Expected node.raw to be a String'));
		expect(() => Node.verify({type: 'MATCH', childNodes: {}, data: {}, raw: ''})).toThrow(new RangeError('Expected node.raw to be a non-empty String'));

		// Verify Meta
		expect(() => Node.verify({type: 'MATCH', childNodes: {}, data: {}, raw: 'Hello World', meta: null})).toThrow(new TypeError('Expected node.meta to be an Object'));
	});

	test('Node.check', () => {
		const validNode = Node.create('MATCH', {}, {}, 'Hello World');

		expect(Node.check(validNode)).toEqual(true);
		expect(Node.check(null)).toEqual(false);
	});
});