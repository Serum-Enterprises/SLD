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

function cloneJSON(data: unknown): unknown {
	if (data === null || typeof data === 'boolean' || Number.isFinite(data) || typeof data === 'string')
		return data;
	if (Array.isArray(data))
		return data.reduce((result: Array<unknown>, item: unknown) => {
			return [...result, cloneJSON(item)];
		}, []);

	if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]')
		return Object.entries(data).reduce((result: { [key: string]: unknown }, [key, value]: [string, unknown]) => {
			return { ...result, [key]: cloneJSON(value) };
		}, {});

	throw new TypeError('Expected data to be valid JSON');
}

export function create(type: TYPE, data: unknown, raw: string) {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type: type,
		data: cloneJSON(data),
		raw: raw,
		meta: Meta.create(raw)
	};
}

export function calculate(precedingNode: Node, type: TYPE, data: unknown, raw: string) {
	if (raw.length === 0)
		throw new RangeError('Expected raw to be a non-empty String');

	return {
		type: type,
		data: cloneJSON(data),
		raw: raw,
		meta: Meta.calculate(precedingNode.meta, raw)
	};
}