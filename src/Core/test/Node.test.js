const { Node } = require('../src/Node');

describe('Testing Node', () => {
	const jsonData = {
		type: 'MATCH',
		raw: '1*2+3',
		children: {
			mul: [{
				type: 'MATCH',
				raw: '1',
				children: {},
				range: [0, 0]
			}, {
				type: 'MATCH',
				raw: '2',
				children: {},
				range: [2, 2]
			}],
			add: [
				{
					type: 'MATCH',
					raw: '3',
					children: {},
					range: [4, 4]
				}
			]
		},
		range: [0, 4]
	};

	test('Testing static fromJSON', () => {
		expect(() => Node.fromJSON(undefined, null)).toThrow(new TypeError('Expected varName to be a String'));
		expect(() => Node.fromJSON(undefined)).toThrow(new TypeError('Expected node to be an Object'));
		expect(() => Node.fromJSON({ type: undefined })).toThrow(new TypeError('Expected node.type to be a String'));
		expect(() => Node.fromJSON({ type: 'TEST' })).toThrow(new RangeError(`Expected node.type to be either "MATCH" or "RECOVER"`))
		expect(() => Node.fromJSON({ type: 'MATCH' })).toThrow(new TypeError('Expected node.raw to be a String'));
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw' })).toThrow(new TypeError('Expected node.children to be an Object'));
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: {} })).toThrow(new TypeError('Expected node.range to be an Array'));
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: { first: null } })).toThrow(new TypeError(`Expected node.children.first to be an Array`))
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: {}, range: [] })).toThrow(new RangeError('Expected node.range to be an Array of length 2'));
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: {}, range: [0.5, 0.5] })).toThrow(new TypeError('Expected node.range[0] to be an Integer'));
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: {}, range: [-1, -1] })).toThrow(new RangeError(`Expected node.range[0] to be greater than or equal to 0`))
		expect(() => Node.fromJSON({ type: 'MATCH', raw: 'raw', children: {}, range: [0, 0.5] })).toThrow(new TypeError('Expected node.range[1] to be an Integer'));

		expect(Node.fromJSON(jsonData)).toBeInstanceOf(Node);
	});

	test('Testing static mergeNodeMaps', () => {
		expect(() => Node.mergeNodeMaps())
			.toThrow(new TypeError('Expected nodeMaps to be an Array'));

		expect(() => Node.mergeNodeMaps([null]))
			.toThrow(new TypeError('Expected nodeMaps[0] to be an Object'));

		expect(() => Node.mergeNodeMaps([{ a: 1 }]))
			.toThrow(new TypeError('Expected nodeMaps[0].a to be an Array'));

		expect(() => Node.mergeNodeMaps([{ a: [1] }]))
			.toThrow(new TypeError('Expected nodeMaps[0].a[0] to be an instance of Node'));

		expect(Node.mergeNodeMaps([{
			a: [new Node('MATCH', 'Hello', {}, [0, 5])],
			b: [new Node('MATCH', 'World', {}, [6, 11])]
		}, {
			b: [new Node('MATCH', 'My', {}, [12, 14])],
		}]))
			.toStrictEqual({
				a: [new Node('MATCH', 'Hello', {}, [0, 5])],
				b: [new Node('MATCH', 'World', {}, [6, 11]), new Node('MATCH', 'My', {}, [12, 14])]
			});
	});

	test('Testing constructor', () => {
		expect(() => new Node(undefined, null, null, null)).toThrow(new TypeError('Expected type to be a String'));
		expect(() => new Node('TEST', null, null, null)).toThrow(new RangeError(`Expected type to be either "MATCH" or "RECOVER"`));
		expect(() => new Node('MATCH', undefined, null, null)).toThrow(new TypeError('Expected raw to be a String'));
		expect(() => new Node('MATCH', 'raw', null, null)).toThrow(new TypeError('Expected children to be an Object'));
		expect(() => new Node('MATCH', 'raw', {}, null)).toThrow(new TypeError('Expected range to be an Array'));
		expect(() => new Node('MATCH', 'raw', { first: null }, [])).toThrow(new TypeError(`Expected children.first to be an Array`));
		expect(() => new Node('MATCH', 'raw', { first: ['Hello World'] }, [])).toThrow(new TypeError(`Expected children.first[0] to be an instance of Node`));
		expect(() => new Node('MATCH', 'raw', {}, [])).toThrow(new RangeError('Expected range to be an Array of length 2'));
		expect(() => new Node('MATCH', 'raw', {}, [0.5, 0.5])).toThrow(new TypeError('Expected range[0] to be an Integer'));
		expect(() => new Node('MATCH', 'raw', {}, [-1, -1])).toThrow(new RangeError(`Expected range[0] to be greater than or equal to 0`));
		expect(() => new Node('MATCH', 'raw', {}, [0, 0.5])).toThrow(new TypeError('Expected range[1] to be an Integer'));

		expect(new Node('MATCH', 'raw', {}, [0, 2])).toBeInstanceOf(Node);
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

	test('Testing createFollower', () => {
		const precedingNode = new Node('MATCH', 'Hello', {}, [0, 4]);

		expect(() => precedingNode.createFollower()).toThrow(new TypeError('Expected type to be a String'));
		expect(() => precedingNode.createFollower('TEST')).toThrow(new RangeError(`Expected type to be either "MATCH" or "RECOVER"`));
		expect(() => precedingNode.createFollower('MATCH')).toThrow(new TypeError('Expected raw to be a String'));
		expect(() => precedingNode.createFollower('MATCH', 'World')).toThrow(new TypeError('Expected children to be an Object'));
		expect(() => precedingNode.createFollower('MATCH', 'World', { a: null })).toThrow(new TypeError(`Expected children.a to be an Array`));
		expect(() => precedingNode.createFollower('MATCH', 'World', { a: ['Hello World'] })).toThrow(new TypeError(`Expected children.a[0] to be an instance of Node`));

		expect(precedingNode.createFollower('MATCH', 'World', { a: [precedingNode] })).toBeInstanceOf(Node);
		expect(precedingNode.createFollower('MATCH', 'World', {})).toBeInstanceOf(Node);
		expect(precedingNode.createFollower('MATCH', 'World', {}).toJSON())
			.toStrictEqual({ type: 'MATCH', raw: 'World', children: {}, range: [5, 9] });
	});

	test('Testing Node.toJSON()', () => {
		const node = Node.fromJSON(jsonData);

		expect(node.toJSON()).toEqual(jsonData);
	});
});
