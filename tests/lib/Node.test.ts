import * as Meta from '../../src/lib/Meta';
import * as Node from '../../src/lib/Node';

/*
import * as Meta from './Meta';

export enum TYPE {
	MATCH = 'MATCH',
	RECOVER = 'RECOVER'
}

export interface Node {
	type: TYPE,
	data: unknown | null,
	childNodes: { [key: string]: Node | Node[] } | null,
	raw: string,
	meta: Meta.Meta
}

export function create(type: TYPE, childNodes: { [key: string]: Node | Node[] } | null, data: unknown | null, raw: string): Node {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type,
		data,
		childNodes,
		raw,
		meta: Meta.create(raw)
	};
}

export function calculate(precedingNode: Node, type: TYPE, childNodes: { [key: string]: Node | Node[] } | null, data: unknown | null, raw: string): Node {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type,
		data,
		childNodes,
		raw,
		meta: Meta.calculate(precedingNode.meta, raw)
	};
}
*/

describe('Testing Node', () => {
	test('Testing Node.create', () => {
		expect(Node.create(Node.TYPE.MATCH, null, null, 'Hello World'))
			.toEqual({
				type: Node.TYPE.MATCH,
				data: null,
				childNodes: null,
				raw: 'Hello World',
				meta: Meta.create('Hello World')
			});

		expect(Node.create(Node.TYPE.RECOVER, null, null, 'Hello World'))
			.toEqual({
				type: Node.TYPE.RECOVER,
				data: null,
				childNodes: null,
				raw: 'Hello World',
				meta: Meta.create('Hello World')
			});

		expect(() => Node.create(Node.TYPE.MATCH, null, null, '')).toThrow(new RangeError('Expected raw to be a non-empty String'))
	});

	test('Testing Node.calculate', () => {
		const precedingNode = Node.create(Node.TYPE.MATCH, null, null, 'Hello World');

		expect(Node.calculate(precedingNode, Node.TYPE.MATCH, null, null, 'Hello World'))
			.toEqual({
				type: Node.TYPE.MATCH,
				data: null,
				childNodes: null,
				raw: 'Hello World',
				meta: Meta.calculate(precedingNode.meta, 'Hello World')
			});

		expect(Node.calculate(precedingNode, Node.TYPE.RECOVER, null, null, 'Hello World'))
			.toEqual({
				type: Node.TYPE.RECOVER,
				data: null,
				childNodes: null,
				raw: 'Hello World',
				meta: Meta.calculate(precedingNode.meta, 'Hello World')
			});

		expect(() => Node.calculate(precedingNode, Node.TYPE.MATCH, null, null, '')).toThrow(new RangeError('Expected raw to be a non-empty String'))
	});
});