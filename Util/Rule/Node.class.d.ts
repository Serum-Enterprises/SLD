import * as Util from './Util.class';
import * as Range from './Range.class';
import * as Location from './Location.class';

export interface NodeJSON {
	data: Util.JSON_T;
	range: Range.RangeJSON;
	location: Location.LocationJSON;
}

export class Node {
	static createNode(precedingNode: Node | null, data: Util.JSON_T, codeString: string): Node;

	constructor(data: Util.JSON_T, range: Range.Range, location: Location.Location);

	get data(): Util.JSON_T;

	get range(): Range.Range;

	get location(): Location.Location;

	clone(): Node;

	toJSON(): NodeJSON;

	toString(): string;
}