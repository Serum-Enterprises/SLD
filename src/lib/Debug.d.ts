export class Debug {
	static #data;
	#dataID;
	#stream;
	#namespace;

	static formatDiff(diff: BigInt): string;
	static create(namespace: string, stream: boolean = true): Debug;

	constructor(namespace: string, stream: boolean = true, dataID: Symbol = Symbol());

	extend(namespace: string): Debug;

	log(message: string): Debug;
	warn(message: string): Debug;
	error(message: string): Debug;

	print(): Debug;
}