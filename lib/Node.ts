import * as Meta from './Meta';

export enum TYPE {
	MATCH = 'MATCH',
	RECOVER = 'RECOVER'
}

export interface Node {
	type: TYPE,
	data: unknown,
	raw: string,
	meta: Meta.Meta
}

export function create(type: TYPE, data: unknown, raw: string): Node {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type: type,
		data: data,
		raw: raw,
		meta: Meta.create(raw)
	};
}

export function calculate(precedingNode: Node, type: TYPE, data: unknown, raw: string): Node {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type: type,
		data: data,
		raw: raw,
		meta: Meta.calculate(precedingNode.meta, raw)
	};
}