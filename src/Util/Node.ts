import { Option } from './Option';

export class Node {
	private _type: string;
	private _raw: string;
	private _children: Map<string, Node[]>;
	private _range: [number, number];

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
			children => new Node("MATCH", raw, children, [0, raw.length - 1]),
			() => new Node("RECOVER", raw, new Map(), [0, raw.length - 1])
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
	constructor(type: string, raw: string, children: Map<string, Node[]>, range: [number, number]) {
		this._type = type;
		this._raw = raw;
		this._children = children;
		this._range = range;
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

	/**
	 * Create a node logically following this node
	 */
	createFollower(raw: string, children: Option<Map<string, Node[]>>): Node {
		return children.match(
			children => new Node("MATCH", raw, children, [this._range[1] + 1, this._range[1] + raw.length]),
			() => new Node("RECOVER", raw, new Map(), [this._range[1] + 1, this._range[1] + raw.length])
		);
	}
}