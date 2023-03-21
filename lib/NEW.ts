import * as Meta from './Meta';

export namespace Node {
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

	export function create(type: TYPE, data: unknown, raw: string) {
		if (raw.length === 0)
			throw new RangeError('Expected raw to be a non-empty String');

		return {
			type: type,
			data: data,
			raw: raw,
			meta: Meta.create(raw)
		};
	}

	export function calculate(precedingNode: Node, type: TYPE, data: unknown, raw: string) {
		if (raw.length === 0)
			throw new RangeError('Expected raw to be a non-empty String');

		return {
			type: type,
			data: data,
			raw: raw,
			meta: Meta.calculate(precedingNode.meta, raw)
		};
	}
}

export namespace Error {
	export enum TYPE {
		ERROR = 'ERROR',
		MISMATCH = 'MISMATCH',
	}

	export interface Error {
		type: TYPE,
		message: string
	}

	export function create(type: TYPE, message: string) {
		return {
			type: type,
			message: message
		};
	}
}

export namespace Result {
	export enum STATUS {
		OK = 'OK',
		ERROR = 'ERROR'
	}

	export interface OK_Result {
		status: STATUS.OK,
		node: Node.Node,
		rest: string
	}

	export interface ERROR_Result {
		status: STATUS.ERROR,
		problem: Error.Error
	}

	export type Result = OK_Result | ERROR_Result;

	export function createOK(type: Node.TYPE, data: unknown, raw: string, rest: string): OK_Result {
		return {
			status: STATUS.OK,
			node: Node.create(type, data, raw),
			rest: rest
		};
	}

	export function createERROR(type: Error.TYPE, message: string): ERROR_Result {
		return {
			status: STATUS.ERROR,
			problem: Error.create(type, message)
		};
	}

	export function calculateOK(precedingNode: Node.Node, type: Node.TYPE, data: unknown, raw: string, rest: string): OK_Result {
		return {
			status: STATUS.OK,
			node: Node.calculate(precedingNode, type, data, raw),
			rest: rest
		};
	}

	export function calculateRaw(firstResult: OK_Result, lastResult: OK_Result): string {
		return firstResult.node.raw + firstResult.rest.slice(0, firstResult.rest.length - lastResult.rest.length);
	}
}