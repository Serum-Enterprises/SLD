import * as Node from './Node.class';

export interface ResultJSON {
	node: Node.NodeJSON;
	rest: string;
}

export class Result {
	constructor(node: Node.Node, rest: string);

	get node(): Node.Node;
	get rest(): string;

	clone(): Result;
	toJSON(): ResultJSON;
	toString(): string;
}