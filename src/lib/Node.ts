interface NodeInterface {
	type: 'MATCH' | 'RECOVER';
	raw: string;
	children: { [key: string]: NodeInterface | NodeInterface[] };
	range: [number, number];
}

export class Node {
	private _type: 'MATCH' | 'RECOVER';
	private _raw: string;
	private _children: { [key: string]: Node | Node[] };
	private _range: [number, number];

	static verifyInterface(node: any, varName: string = 'node'): node is NodeInterface {
		if (typeof varName !== 'string')
			throw new TypeError('Expected varName to be a String');

		if (Object.prototype.toString.call(node) !== '[object Object]')
			throw new TypeError(`Expected ${varName} to be an Object`);

		if ((typeof node.type !== 'string'))
			throw new TypeError(`Expected ${varName}.type to be a String`);

		if (!['MATCH', 'RECOVER'].includes(node.type.toUpperCase()))
			throw new RangeError(`Expected ${varName}.type to be either "MATCH" or "RECOVER"`);

		if (typeof node.raw !== 'string')
			throw new TypeError(`Expected ${varName}.raw to be a String`);

		if (Object.prototype.toString.call(node.children) !== '[object Object]')
			throw new TypeError(`Expected ${varName}.children to be an Object`);

		Object.entries(node.children).forEach(([name, child]) => {
			if (Array.isArray(child))
				child.forEach((child, index) => {
					Node.verifyInterface(child, `${varName}.children.${name}[${index}]`);
				});
			else if (Object.prototype.toString.call(child) === '[object Object]')
				Node.verifyInterface(child, `${varName}.children.${name}`);
			else
				throw new TypeError(`Expected ${varName}.children.${name} to be a Node Interface or an Array of Node Interfaces`);
		});

		if (!Array.isArray(node.range))
			throw new TypeError(`Expected ${varName}.range to be an Array`);

		if (node.range.length !== 2)
			throw new RangeError(`Expected ${varName}.range to be an Array of length 2`);

		node.range.forEach((value: any, index: number) => {
			if (!Number.isSafeInteger(value))
				throw new TypeError(`Expected ${varName}.range[${index}] to be an Integer`);

			if (value < 0)
				throw new RangeError(`Expected ${varName}.range[${index}] to be greater than or equal to 0`);
		});

		return node;
	}

	static fromJSON(node: NodeInterface, varName: string = 'node'): Node {
		return new Node(
			node.type,
			node.raw,
			Object.entries(node.children)
				.reduce((children: { [key: string]: Node | Node[] }, [name, child]: [string, NodeInterface | NodeInterface[]]) => {
					if (Array.isArray(child))
						children[name] = child.map(child => Node.fromJSON(child, `${varName}.children.${name}`));
					else
						children[name] = Node.fromJSON(child, `${varName}.children.${name}`);

					return children;
				}, {}),
			node.range
		);
	}
	
	constructor(type: 'MATCH' | 'RECOVER', raw: string, children: { [key: string]: Node | Node[] }, range: [number, number]) {
		this._type = type;
		this._raw = raw;
		this._children = children;
		this._range = range;
	}

	get type(): 'MATCH' | 'RECOVER' {
		return this._type;
	}

	get raw(): string {
		return this._raw;
	}

	get children(): { [key: string]: Node | Node[] } {
		return this._children;
	}

	get range(): [number, number] {
		return this._range;
	}

	toJSON(): NodeInterface {
		return {
			type: this._type,
			raw: this._raw,
			children: Object.entries(this._children)
				.reduce((children: { [key: string]: NodeInterface | NodeInterface[] }, [name, child]: [string, Node | Node[]]) => {
					if (Array.isArray(child))
						children[name] = child.map(child => child.toJSON());
					else
						children[name] = child.toJSON();

					return children;
				}, {}),
			range: this._range
		};
	}
}