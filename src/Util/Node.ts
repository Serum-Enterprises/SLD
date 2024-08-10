import { Option } from './Option';

export type JSON = null | boolean | number | string | Array<JSON> | { [key: string]: JSON };

export class Node {
	private _type: string;
	private _raw: string;
	private _children: Map<string, Node[]>;
	private _range: [number, number];
	private _meta: JSON;

	/**
	 * Merge two NodeMaps
	 */
	static mergeNodeMaps(nodeMaps: Map<string, Node[]>[]): Map<string, Node[]> {
		const result: Map<string, Node[]> = new Map();

		nodeMaps.forEach(nodeMap => {
			nodeMap.forEach((value, key) => {
				if (!result.has(key))
					result.set(key, []);

				value.forEach(node => (result.get(key) as Node[]).push(node));
			});
		});

		return result;
	}

	/**
	 * Create a new node
	 */
	static create(raw: string, children: Option<Map<string, Node[]>>): Node {
		return children.match(
			children => new Node("MATCH", raw, children, [0, raw.length - 1], null),
			() => new Node("RECOVER", raw, new Map(), [0, raw.length - 1], null)
		);
	}

	/**
	 * Create a node with an optional preceding node
	 */
	static createFollowerWith(precedingNode: Option<Node>, raw: string, children: Option<Map<string, Node[]>>): Node {
		return precedingNode.match(
			precedingNode => precedingNode.createFollower(raw, children),
			() => Node.create(raw, children)
		);
	}

	/**
	 * Construct a new node
	 */
	constructor(type: string, raw: string, children: Map<string, Node[]>, range: [number, number], meta: JSON) {
		this._type = type;
		this._raw = raw;
		this._children = children;
		this._range = range;
		this._meta = meta;
	}

	get type(): string {
		return this._type;
	}

	get raw(): string {
		return this._raw;
	}

	get children(): Map<string, Node[]> {
		return this._children;
	}

	get range(): [number, number] {
		return this._range;
	}

	get meta(): JSON {
		return this._meta;
	}

	/**
	 * Create a node logically following this node
	 */
	createFollower(raw: string, children: Option<Map<string, Node[]>>): Node {
		return children.match(
			children => new Node("MATCH", raw, children, [this._range[1] + 1, this._range[1] + raw.length], null),
			() => new Node("RECOVER", raw, new Map(), [this._range[1] + 1, this._range[1] + raw.length], null)
		);
	}

	toJSON(): JSON {
		const children: { [key: string]: Node[] } = {};

		this._children.forEach((value, key) => {
			children[key] = value;
		});

		return {
			type: this._type,
			raw: this._raw,
			children: Array.from(this._children.entries()).reduce((result, [key, value]) => {
				return { ...result, [key]: value };
			}, {}),
			range: this._range,
			meta: this._meta
		};
	}
}