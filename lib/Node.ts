export enum TYPE {
	MATCH = 'MATCH',
	RECOVER = 'RECOVER'
}

export class Node {
	private _type: TYPE;
	private _raw: string;
	private _children: { [key: string]: Node | Node[] };
	private _range: [number, number];

	public constructor(type: TYPE, raw: string, children: { [key: string]: Node | Node[] }, range: [number, number]) {
		this._type = type;
		this._raw = raw;
		this._children = children;
		this._range = range;
	}

	public get type() {
		return this._type;
	}

	public get raw() {
		return this._raw;
	}

	public get children() {
		return this._children;
	}

	public get range() {
		return this._range;
	}

	public toJSON() {
		return {
			type: this._type,
			value: this._raw,
			children: this._children,
			range: this._range
		};
	}
}