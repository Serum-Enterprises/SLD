import { Node, NodeInterface } from '../../src/lib/Node';

describe('Testing Node', () => {
	test('Testing static verifyInterface', () => {
		expect(() => Node.verifyInterface(undefined)).toThrow(new TypeError('Expected node to be an Object'));
		expect(() => Node.verifyInterface({ type: undefined })).toThrow(new TypeError('Expected node.type to be a String'));
		expect(() => Node.verifyInterface({ type: 'TEST' })).toThrow(new RangeError(`Expected node.type to be either "MATCH" or "RECOVER"`))
		expect(() => Node.verifyInterface({ type: 'MATCH' })).toThrow(new TypeError('Expected node.raw to be a String'));
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw' })).toThrow(new TypeError('Expected node.children to be an Object'));
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: {} })).toThrow(new TypeError('Expected node.range to be an Array'));
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: { 'first': null } })).toThrow(new TypeError(`Expected node.children.first to be a Node Interface or an Array of Node Interfaces`))
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: {}, range: [] })).toThrow(new RangeError('Expected node.range to be an Array of length 2'));
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: {}, range: [0.5, 0.5] })).toThrow(new TypeError('Expected node.range[0] to be an Integer'));
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: {}, range: [-1, -1] })).toThrow(new RangeError(`Expected node.range[0] to be greater than or equal to 0`))
		expect(() => Node.verifyInterface({ type: 'MATCH', raw: 'raw', children: {}, range: [0, 0.5] })).toThrow(new TypeError('Expected node.range[1] to be an Integer'));

		const validNodeInterface = {
			type: 'MATCH',
			raw: '1+2+xyz',
			children: {
				first: {
					type: 'MATCH',
					raw: '1',
					children: {},
					range: [0, 0]
				},
				second: {
					type: 'MATCH',
					raw: '2',
					children: {},
					range: [2, 2]
				},
				text: [
					{
						type: 'MATCH',
						raw: 'x',
						children: {},
						range: [4, 4]
					},
					{
						type: 'MATCH',
						raw: 'y',
						children: {},
						range: [5, 5]
					},
					{
						type: 'MATCH',
						raw: 'z',
						children: {},
						range: [6, 6]
					}
				]
			},
			range: [0, 6]
		};

		expect(() => Node.verifyInterface(validNodeInterface)).not.toThrow();
	});

	test('Testing static fromJSON', () => {
		const validNodeInterface: NodeInterface = {
			type: 'MATCH',
			raw: '1+2+xyz',
			children: {
				first: {
					type: 'MATCH',
					raw: '1',
					children: {},
					range: [0, 0]
				},
				second: {
					type: 'MATCH',
					raw: '2',
					children: {},
					range: [2, 2]
				},
				text: [
					{
						type: 'MATCH',
						raw: 'x',
						children: {},
						range: [4, 4]
					},
					{
						type: 'MATCH',
						raw: 'y',
						children: {},
						range: [5, 5]
					},
					{
						type: 'MATCH',
						raw: 'z',
						children: {},
						range: [6, 6]
					}
				]
			},
			range: [0, 6]
		};

		expect(Node.fromJSON(validNodeInterface)).toBeInstanceOf(Node);
	});

	test('Testing constructor', () => {
		expect(new Node('MATCH', 'raw', {}, [0, 1])).toBeInstanceOf(Node);
	});

	test('Testing get type', () => {
		expect(new Node('MATCH', 'raw', {}, [0, 1]).type).toBe('MATCH');
	});

	test('Testing get raw', () => {
		expect(new Node('MATCH', 'raw', {}, [0, 1]).raw).toBe('raw');
	});

	test('Testing get children', () => {
		expect(new Node('MATCH', 'raw', {}, [0, 1]).children).toEqual({});
	});

	test('Testing get range', () => {
		expect(new Node('MATCH', 'raw', {}, [0, 1]).range).toEqual([0, 1]);
	});

	test('Testing Node.toJSON()', () => {
		const validNodeInterface: NodeInterface = {
			type: 'MATCH',
			raw: '1+2+xyz',
			children: {
				first: {
					type: 'MATCH',
					raw: '1',
					children: {},
					range: [0, 0]
				},
				second: {
					type: 'MATCH',
					raw: '2',
					children: {},
					range: [2, 2]
				},
				text: [
					{
						type: 'MATCH',
						raw: 'x',
						children: {},
						range: [4, 4]
					},
					{
						type: 'MATCH',
						raw: 'y',
						children: {},
						range: [5, 5]
					},
					{
						type: 'MATCH',
						raw: 'z',
						children: {},
						range: [6, 6]
					}
				]
			},
			range: [0, 6]
		};

		const node = Node.fromJSON(validNodeInterface);

		expect(node.toJSON()).toEqual(validNodeInterface);
	});
});
