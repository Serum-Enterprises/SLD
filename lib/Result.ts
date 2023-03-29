import * as Node from './Node';
import * as Problem from './Problem';

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
	problem: Problem.Problem
}

export type Result = OK_Result | ERROR_Result;

export function createOK(type: Node.TYPE, childNodes: { [key: string]: Node.Node | Node.Node[] } | null, data: unknown | null, raw: string, rest: string): OK_Result {
	return {
		status: STATUS.OK,
		node: Node.create(type, childNodes, data, raw),
		rest: rest
	};
}

export function createERROR(type: Problem.TYPE, message: string): ERROR_Result {
	return {
		status: STATUS.ERROR,
		problem: Problem.create(type, message)
	};
}

export function calculateOK(precedingNode: Node.Node, type: Node.TYPE, childNodes: { [key: string]: Node.Node | Node.Node[] } | null, data: unknown | null, raw: string, rest: string): OK_Result {
	return {
		status: STATUS.OK,
		node: Node.calculate(precedingNode, type, childNodes, data, raw),
		rest: rest
	};
}

export function calculateRaw(firstResult: OK_Result, lastResult: OK_Result): string {
	return firstResult.node.raw + firstResult.rest.slice(0, firstResult.rest.length - lastResult.rest.length);
}