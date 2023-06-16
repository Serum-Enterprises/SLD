/*
enum NodeType {
	MATCH = 'MATCH',
	RECOVER = 'RECOVER'
}

interface Node {
	type: NodeType,
	variantName: string,
	value: string,
	children: Node[]
	range: [number, number]
}
*/

class Node {
	#type;
	#variantName;
	#value;
	#children;
	#range;

	constructor(type, variantName, value, children, range) {
		if (typeof type !== 'string')
			throw new TypeError('Expected type to be a String');

		if (!['MATCH', 'RECOVERY'].includes(type))
			throw new RangeError('Expected type to be one of "MATCH" or "RECOVER"');

		if (typeof variantName !== 'string')
			throw new TypeError('Expected variantName to be a String');

		if (typeof value !== 'string')
			throw new TypeError('Expected value to be a String');

		if (!(Array.isArray(children) && children.every(n => n instanceof Node)))
			throw new TypeError('Expected children to be an Array of Node Instances');

		if (!(Array.isArray(range) && range.length === 2 && range.every(n => Number.isSafeInteger(n) && n >= 0)))
			throw new TypeError('Expected range to be an Array of two positive Integers');

		this.#type = type;
		this.#variantName = variantName;
		this.#value = value;
		this.#children = [...children];
		this.#range = [...range];
	}

	get type() {
		return this.#type;
	}

	get variantName() {
		return this.#variantName;
	}

	get value() {
		return this.#value;
	}

	get children() {
		return [...this.#children];
	}

	get range() {
		return [...this.#range];
	}

	toJSON() {
		return {
			type: this.#type,
			variantName: this.#variantName,
			value: this.#value,
			children: this.#children.map(c => c.toJSON()),
			range: [...this.#range]
		};
	}
}