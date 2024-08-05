import { Option } from './Option';

export class Node {
	private _type: string;
	private _raw: string;
	private _children: { [key: string]: Node[] };
	private _range: [number, number];

	/**
	 * Merge two NodeMaps
	 */
	static mergeNodeMaps(nodeMaps: { [key: string]: Node[] }[]): { [key: string]: Node[] } {
		const result: { [key: string]: Node[] } = {};

		nodeMaps.forEach(nodeMap => {
			Object.entries(nodeMap).forEach(([key, value]) => {
				if (!Array.isArray(result[key]))
					result[key] = [];

				value.forEach(node => result[key].push(node));
			});
		});

		return result;
	}

	/**
	 * Create a new node
	 */
	static create(raw: string, children: Option<{ [key: string]: Node[] }>): Node {
		return children.match(
			children => new Node("MATCH", raw, children, [0, raw.length - 1]),
			() => new Node("RECOVER", raw, {}, [0, raw.length - 1])
		);
	}

	/**
	 * Create a node with an optional preceding node
	 */
	static createFollowerWith(precedingNode: Option<Node>, raw: string, children: Option<{ [key: string]: Node[] }>): Node {
		return precedingNode.match(
			precedingNode => precedingNode.createFollower(raw, children),
			() => Node.create(raw, children)
		);
	}

	/**
	 * Construct a new node
	 */
	private constructor(type: string, raw: string, children: { [key: string]: Node[] }, range: [number, number]) {
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

	get children(): { [key: string]: Node[] } {
		return this._children;
	}

	get range(): [number, number] {
		return this._range;
	}

	/**
	 * Create a node logically following this node
	 */
	createFollower(raw: string, children: Option<{ [key: string]: Node[] }>): Node {
		return children.match(
			children => new Node("MATCH", raw, children, [this._range[1] + 1, this._range[1] + raw.length]),
			() => new Node("RECOVER", raw, {}, [this._range[1] + 1, this._range[1] + raw.length])
		);
	}
}