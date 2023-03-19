import * as Node from './Node';

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
	message: string,
	node: null | Node.Node,
	rest: null | string
}

export type Result = OK_Result | ERROR_Result;

export function createOK(type: Node.TYPE, data: unknown, raw: string, rest: string): OK_Result {
	return {
		status: STATUS.OK,
		node: Node.create(type, data, raw),
		rest: rest
	};
}

export function createERROR(message: string, node: null | Node.Node = null, rest: null | string = null): ERROR_Result {
	return {
		status: STATUS.ERROR,
		message: message,
		node: node,
		rest: rest
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